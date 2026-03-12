"""Populate image URLs (team logos, player photos, competition logo, country flag)
by parsing cached SofaScore and ESPN data from soccerdata.

Requires: populate_db.py must have been run first (to create cached data and DB records).

Usage:
    python scripts/populate_images.py --seasons 2024-2025
"""

import json
import os
import sys
import argparse
import logging
from pathlib import Path
from urllib.parse import urlparse

import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# ==========================================
# LOGGING
# ==========================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

# ==========================================
# CONFIG
# ==========================================
SOCCERDATA_DIR = Path.home() / "soccerdata" / "data"
SOFASCORE_MATCHES_DIR = SOCCERDATA_DIR / "Sofascore" / "matches"
ESPN_DIR = SOCCERDATA_DIR / "ESPN"

SOFASCORE_TEAM_IMAGE_URL = "https://api.sofascore.com/api/v1/team/{team_id}/image"
SOFASCORE_TOURNAMENT_IMAGE_URL = "https://api.sofascore.com/api/v1/unique-tournament/238/image"
ESPN_PLAYER_IMAGE_URL = "https://a.espncdn.com/i/headshots/soccer/players/full/{player_id}.png"
COUNTRY_FLAG_URL = "https://flagcdn.com/w160/pt.png"


# ==========================================
# UTILITY
# ==========================================
def parse_jdbc_url(jdbc_url: str) -> dict:
    url = jdbc_url.replace("jdbc:", "")
    parsed = urlparse(url)
    return {
        "host": parsed.hostname,
        "port": str(parsed.port),
        "dbname": parsed.path.lstrip("/"),
    }


def connect_db():
    env_path = Path(__file__).resolve().parent.parent / "backend" / ".env"
    load_dotenv(env_path)

    jdbc_url = os.getenv("DB_URL")
    if not jdbc_url:
        logger.error("DB_URL not found in .env")
        sys.exit(1)

    db_config = parse_jdbc_url(jdbc_url)
    db_config["user"] = os.getenv("DB_USERNAME")
    db_config["password"] = os.getenv("DB_PASSWORD")

    conn = psycopg2.connect(**db_config)
    conn.autocommit = False
    return conn


def season_to_code(season_str: str) -> str:
    parts = season_str.split("-")
    if len(parts) == 2:
        return parts[0][-2:] + parts[1][-2:]
    return season_str


def load_team_name_replacements():
    path = Path.home() / "soccerdata" / "config" / "teamname_replacements.json"
    if not path.is_file():
        return {}
    with open(path, "r") as f:
        data = json.load(f)
    return {k: v for k, v in data.items() if v}


# ==========================================
# SOFASCORE: TEAM LOGOS
# ==========================================
def extract_sofascore_team_ids(season_code):
    """Parse cached SofaScore match files to build {team_name: sofascore_id} map."""
    team_ids = {}
    pattern = f"round_matches_POR-Primeira Liga_{season_code}_"

    for filepath in sorted(SOFASCORE_MATCHES_DIR.glob(f"{pattern}*.json")):
        with open(filepath, "r") as f:
            data = json.load(f)

        for event in data.get("events", []):
            for side in ("homeTeam", "awayTeam"):
                team = event.get(side, {})
                name = team.get("name")
                tid = team.get("id")
                if name and tid:
                    team_ids[name] = tid

    logger.info("[sofascore] Found %d team IDs from cached data", len(team_ids))
    return team_ids


def update_team_logos(cur, team_ids):
    """Update team.logo_url using SofaScore team IDs."""
    count = 0
    for team_name, team_id in team_ids.items():
        logo_url = SOFASCORE_TEAM_IMAGE_URL.format(team_id=team_id)
        cur.execute(
            'UPDATE team SET logo_url = %s, updated_at = CURRENT_TIMESTAMP WHERE name = %s AND logo_url IS NULL',
            (logo_url, team_name),
        )
        if cur.rowcount > 0:
            count += 1

    logger.info("[teams] %d team logos updated", count)


# ==========================================
# ESPN: PLAYER PHOTOS
# ==========================================
def extract_espn_game_ids(season_code):
    """Get ESPN game IDs from cached schedule files for the season."""
    game_ids = set()

    # Season code like "2425" means Aug 2024 - May 2025
    start_year = 2000 + int(season_code[:2])
    end_year = 2000 + int(season_code[2:])

    for filepath in sorted(ESPN_DIR.glob("Schedule_por.1_*.json")):
        date_str = filepath.stem.split("_")[-1]  # e.g. "20240809"
        year = int(date_str[:4])
        month = int(date_str[4:6])

        # Filter to this season's date range (Aug start_year to May end_year)
        if year == start_year and month >= 8:
            pass  # in range
        elif year == end_year and month <= 7:
            pass  # in range
        else:
            continue

        with open(filepath, "r") as f:
            data = json.load(f)

        for event in data.get("events", []):
            gid = event.get("id")
            if gid:
                game_ids.add(str(gid))

    logger.info("[espn] Found %d game IDs for season %s", len(game_ids), season_code)
    return game_ids


def extract_espn_player_ids(game_ids):
    """Parse cached ESPN summary files to build {player_name: espn_athlete_id} map."""
    player_ids = {}

    for gid in sorted(game_ids):
        filepath = ESPN_DIR / f"Summary_{gid}.json"
        if not filepath.is_file():
            continue

        with open(filepath, "r") as f:
            data = json.load(f)

        for roster in data.get("rosters", []):
            for p in roster.get("roster", []):
                athlete = p.get("athlete", {})
                name = athlete.get("displayName")
                pid = athlete.get("id")
                if name and pid:
                    player_ids[name] = str(pid)

    logger.info("[espn] Found %d player IDs from cached summaries", len(player_ids))
    return player_ids


def update_player_photos(cur, player_ids):
    """Update player.photo_url using ESPN athlete IDs."""
    count = 0
    for player_name, pid in player_ids.items():
        photo_url = ESPN_PLAYER_IMAGE_URL.format(player_id=pid)
        cur.execute(
            'UPDATE player SET photo_url = %s, updated_at = CURRENT_TIMESTAMP WHERE name = %s AND photo_url IS NULL',
            (photo_url, player_name),
        )
        if cur.rowcount > 0:
            count += 1

    logger.info("[players] %d player photos updated", count)


# ==========================================
# STATIC: COMPETITION + COUNTRY
# ==========================================
def update_competition_logo(cur):
    cur.execute(
        "UPDATE competition SET logo_url = %s, updated_at = CURRENT_TIMESTAMP WHERE code = 'POR-Primeira Liga' AND logo_url IS NULL",
        (SOFASCORE_TOURNAMENT_IMAGE_URL,),
    )
    if cur.rowcount > 0:
        logger.info("[competition] Logo URL set")


def update_country_flag(cur):
    cur.execute(
        "UPDATE country SET flag_url = %s, updated_at = CURRENT_TIMESTAMP WHERE code = 'PRT' AND flag_url IS NULL",
        (COUNTRY_FLAG_URL,),
    )
    if cur.rowcount > 0:
        logger.info("[country] Flag URL set")


# ==========================================
# CLI + MAIN
# ==========================================
def parse_args():
    parser = argparse.ArgumentParser(
        description="Populate image URLs from cached SofaScore + ESPN data."
    )
    parser.add_argument(
        "--seasons", nargs="+", required=True,
        help="Season(s) in YYYY-YYYY format (e.g., 2024-2025)"
    )
    return parser.parse_args()


def main():
    args = parse_args()
    conn = connect_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        for season_str in args.seasons:
            season_code = season_to_code(season_str)
            logger.info("Processing season %s (code: %s)", season_str, season_code)

            # Team logos from SofaScore cache
            team_ids = extract_sofascore_team_ids(season_code)
            if team_ids:
                update_team_logos(cur, team_ids)
                conn.commit()
            else:
                logger.warning("No SofaScore cached data found. Run populate_db.py first.")

            # Player photos from ESPN cache
            game_ids = extract_espn_game_ids(season_code)
            if game_ids:
                player_ids = extract_espn_player_ids(game_ids)
                if player_ids:
                    update_player_photos(cur, player_ids)
                    conn.commit()
            else:
                logger.warning("No ESPN cached data found. Run populate_db.py with --stages all first.")

        # Static entries
        update_competition_logo(cur)
        update_country_flag(cur)
        conn.commit()

        logger.info("Image population complete!")

    except Exception as e:
        conn.rollback()
        logger.error("Failed: %s", e, exc_info=True)
        sys.exit(1)
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()
