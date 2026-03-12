"""
Populate the predictfootball database using SofaScore + ESPN via the soccerdata library.

SofaScore: schedule (teams, matches), league table (standings)
ESPN:      lineups (players, player stats), match sheets (team stats)

Usage:
    python scripts/populate_db.py --seasons 2024-2025
    python scripts/populate_db.py --seasons 2024-2025 --stages all
    python scripts/populate_db.py --seasons 2023-2024 2024-2025
"""

import json
import os
import sys
import argparse
import logging
from pathlib import Path
from urllib.parse import urlparse
from collections import defaultdict

# ==========================================
# LEAGUE CONFIG BOOTSTRAP (before soccerdata import)
# ==========================================
def ensure_league_config():
    """Ensure the custom league dict includes POR-Primeira Liga and SofaScore knows about it."""
    config_path = Path.home() / "soccerdata" / "config" / "league_dict.json"
    config_path.parent.mkdir(parents=True, exist_ok=True)

    league_entry = {
        "POR-Primeira Liga": {
            "FBref": "Primeira Liga",
            "Sofascore": "Primeira Liga",
            "ESPN": "por.1",
            "season_start": "Aug",
            "season_end": "May",
        }
    }

    if config_path.is_file():
        with open(config_path, "r") as f:
            existing = json.load(f)
        if "POR-Primeira Liga" not in existing:
            existing.update(league_entry)
            with open(config_path, "w") as f:
                json.dump(existing, f, indent=2)
    else:
        with open(config_path, "w") as f:
            json.dump(league_entry, f, indent=2)

    # SofaScore's default tournament list doesn't include Primeira Liga (ID 238).
    # Ensure the cached leagues.json contains it so soccerdata can find it.
    leagues_path = Path.home() / "soccerdata" / "data" / "Sofascore" / "leagues.json"
    leagues_path.parent.mkdir(parents=True, exist_ok=True)

    primeira_liga_entry = {
        "id": 238,
        "name": "Primeira Liga",
    }

    if leagues_path.is_file():
        with open(leagues_path, "r") as f:
            leagues_data = json.load(f)
        tournaments = leagues_data.get("uniqueTournaments", [])
        if not any(t.get("id") == 238 for t in tournaments):
            tournaments.append(primeira_liga_entry)
            leagues_data["uniqueTournaments"] = tournaments
            with open(leagues_path, "w") as f:
                json.dump(leagues_data, f, indent=2)
    else:
        with open(leagues_path, "w") as f:
            json.dump({"uniqueTournaments": [primeira_liga_entry]}, f, indent=2)


ensure_league_config()
import soccerdata as sd
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import pandas as pd
import numpy as np

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
# UTILITY FUNCTIONS
# ==========================================
def clean_val(val):
    """Convert pandas/numpy NaN to Python None for PostgreSQL."""
    if val is None:
        return None
    if isinstance(val, float) and pd.isna(val):
        return None
    if isinstance(val, (np.integer, int)):
        return int(val)
    if isinstance(val, (np.floating, float)):
        return float(val)
    if isinstance(val, str) and val.strip() == "":
        return None
    try:
        if pd.isna(val):
            return None
    except (TypeError, ValueError):
        pass
    return val


def parse_jdbc_url(jdbc_url: str) -> dict:
    """Parse jdbc:postgresql://host:port/dbname into components."""
    url = jdbc_url.replace("jdbc:", "")
    parsed = urlparse(url)
    return {
        "host": parsed.hostname,
        "port": str(parsed.port),
        "dbname": parsed.path.lstrip("/"),
    }


def season_to_code(season_str: str) -> str:
    """Convert '2025-2026' to '2526' for soccerdata."""
    parts = season_str.split("-")
    if len(parts) == 2:
        return parts[0][-2:] + parts[1][-2:]
    return season_str


def season_start_year(season_str: str) -> int:
    """Extract start year from '2025-2026' -> 2025."""
    return int(season_str.split("-")[0])


def safe_int(val):
    """Convert to int, handling commas and NaN."""
    val = clean_val(val)
    if val is None:
        return None
    if isinstance(val, str):
        val = val.replace(",", "")
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return None


def safe_float(val):
    """Convert to float, handling NaN."""
    val = clean_val(val)
    if val is None:
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def map_espn_position(espn_pos):
    """Map ESPN position string to DB enum (GK, DF, MF, FW)."""
    if not espn_pos or pd.isna(espn_pos):
        return None
    pos = str(espn_pos).strip().lower()
    mapping = {
        "goalkeeper": "GK",
        "defender": "DF",
        "midfielder": "MF",
        "forward": "FW",
    }
    return mapping.get(pos)


def load_team_name_replacements():
    """Load ESPN -> SofaScore team name replacements from config file.

    Returns a dict mapping ESPN names to SofaScore names.
    """
    path = Path.home() / "soccerdata" / "config" / "teamname_replacements.json"
    if not path.is_file():
        return {}
    with open(path, "r") as f:
        data = json.load(f)
    # Only return entries that have a non-empty replacement value
    return {k: v for k, v in data.items() if v}


def _generate_replacement_stubs(unmatched_names):
    """Auto-generate a stub teamname_replacements.json with unmatched names as keys."""
    path = Path.home() / "soccerdata" / "config" / "teamname_replacements.json"
    path.parent.mkdir(parents=True, exist_ok=True)

    existing = {}
    if path.is_file():
        with open(path, "r") as f:
            existing = json.load(f)

    changed = False
    for name in sorted(unmatched_names):
        if name not in existing:
            existing[name] = ""
            changed = True

    if changed:
        with open(path, "w") as f:
            json.dump(existing, f, indent=2, sort_keys=True)
        logger.warning("Updated %s with %d stub entries — fill in correct SofaScore names",
                       path, len(unmatched_names))


def _apply_team_replacements(team_map):
    """Return team_map augmented with ESPN name aliases from replacements config."""
    replacements = load_team_name_replacements()
    augmented = dict(team_map)
    for espn_name, sofascore_name in replacements.items():
        if sofascore_name in team_map and espn_name not in augmented:
            augmented[espn_name] = team_map[sofascore_name]
    return augmented


# ==========================================
# DATABASE CONNECTION
# ==========================================
def connect_db():
    """Connect to PostgreSQL using backend/.env credentials."""
    env_path = Path(__file__).resolve().parent.parent / "backend" / ".env"
    load_dotenv(env_path)

    jdbc_url = os.getenv("DB_URL")
    username = os.getenv("DB_USERNAME")
    password = os.getenv("DB_PASSWORD")

    if not jdbc_url:
        logger.error("DB_URL not found in .env file at %s", env_path)
        sys.exit(1)

    db_config = parse_jdbc_url(jdbc_url)
    db_config["user"] = username
    db_config["password"] = password

    logger.info("Connecting to PostgreSQL at %s:%s/%s", db_config["host"], db_config["port"], db_config["dbname"])
    conn = psycopg2.connect(**db_config)
    conn.autocommit = False
    return conn


# ==========================================
# PIPELINE STAGES
# ==========================================

def stage_base(cur, season_str):
    """Stage 1: Upsert country, competition, season. Returns (country_id, competition_id, season_id)."""
    logger.info("[base] Upserting country, competition, season for %s...", season_str)
    start_year = season_start_year(season_str)

    cur.execute("""
        INSERT INTO country (name, code, created_at, updated_at)
        VALUES ('Portugal', 'PRT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (name) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
        RETURNING id;
    """)
    country_id = cur.fetchone()["id"]

    cur.execute("""
        INSERT INTO competition (name, code, type, country_id, created_at, updated_at)
        VALUES ('Primeira Liga', 'POR-Primeira Liga', 'LEAGUE', %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (code) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
        RETURNING id;
    """, (country_id,))
    competition_id = cur.fetchone()["id"]

    cur.execute("""
        INSERT INTO season (competition_id, year, start_date, end_date, current, created_at, updated_at)
        VALUES (%s, %s, %s, %s, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (competition_id, year) DO UPDATE SET
            current = EXCLUDED.current, updated_at = CURRENT_TIMESTAMP
        RETURNING id;
    """, (competition_id, start_year, f"{start_year}-08-01", f"{start_year + 1}-05-31"))
    season_id = cur.fetchone()["id"]

    logger.info("[base] country_id=%s, competition_id=%s, season_id=%s", country_id, competition_id, season_id)
    return country_id, competition_id, season_id


def stage_teams(cur, schedule, country_id):
    """Stage 2: Upsert teams from SofaScore schedule. Returns team_map {name: id}."""
    logger.info("[teams] Extracting and upserting teams...")
    df = schedule.reset_index()
    unique_teams = set(df["home_team"]).union(set(df["away_team"]))
    team_map = {}

    for team_name in sorted(unique_teams):
        if pd.isna(team_name) or not team_name:
            continue
        cur.execute("SELECT id FROM team WHERE name = %s", (team_name,))
        res = cur.fetchone()
        if res:
            team_map[team_name] = res["id"]
        else:
            cur.execute("""
                INSERT INTO team (name, country_id, created_at, updated_at)
                VALUES (%s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id;
            """, (team_name, country_id))
            team_map[team_name] = cur.fetchone()["id"]

    logger.info("[teams] %d teams upserted", len(team_map))
    return team_map


def stage_matches(cur, schedule, season_id, team_map):
    """Stage 3: Upsert matches from SofaScore schedule."""
    logger.info("[matches] Upserting matches...")
    df = schedule.reset_index()
    count = 0

    for _, row in df.iterrows():
        home_team = row.get("home_team")
        away_team = row.get("away_team")
        if pd.isna(home_team) or pd.isna(away_team):
            continue

        home_id = team_map.get(home_team)
        away_id = team_map.get(away_team)
        if not home_id or not away_id:
            continue

        # SofaScore provides home_score/away_score directly
        home_score = safe_int(row.get("home_score"))
        away_score = safe_int(row.get("away_score"))
        status = "FINISHED" if home_score is not None and away_score is not None else "SCHEDULED"
        kickoff = clean_val(row.get("date"))
        if kickoff is None:
            logger.warning("[matches] Skipping %s vs %s: no kickoff date", home_team, away_team)
            continue
        matchday = safe_int(row.get("round")) or safe_int(row.get("week"))
        game_id = clean_val(row.get("game_id"))
        if game_id is not None:
            game_id = str(game_id)

        # Prefer dedup by external_id when available, fall back to home/away pair
        if game_id is not None:
            cur.execute("""
                SELECT id FROM "match"
                WHERE season_id = %s AND external_id = %s
            """, (season_id, game_id))
        else:
            cur.execute("""
                SELECT id FROM "match"
                WHERE season_id = %s AND home_team_id = %s AND away_team_id = %s
            """, (season_id, home_id, away_id))
        res = cur.fetchone()

        if res:
            match_id = res["id"]
            cur.execute("""
                UPDATE "match"
                SET home_score = %s, away_score = %s, status = %s, matchday = %s,
                    kickoff = %s, external_id = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (home_score, away_score, status, matchday, kickoff, game_id, match_id))
        else:
            cur.execute("""
                INSERT INTO "match" (season_id, matchday, home_team_id, away_team_id,
                    home_score, away_score, status, kickoff, external_id,
                    created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,
                    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING id;
            """, (season_id, matchday, home_id, away_id, home_score, away_score,
                  status, kickoff, game_id))
            cur.fetchone()

        count += 1

    logger.info("[matches] %d matches upserted", count)


def stage_standings(cur, sofa, season_id, team_map, force_cache=False):
    """Stage 4: Upsert standings from SofaScore league table."""
    logger.info("[standings] Fetching league table from SofaScore...")

    try:
        table = sofa.read_league_table(force_cache=force_cache)
    except Exception as e:
        logger.error("[standings] Failed to fetch league table: %s", e)
        logger.info("[standings] Falling back to calculating from matches...")
        _standings_from_matches(cur, season_id)
        return

    if table.empty:
        logger.warning("[standings] Empty league table, falling back to match calculation...")
        _standings_from_matches(cur, season_id)
        return

    df = table.reset_index()
    count = 0

    for position, (_, row) in enumerate(df.iterrows(), start=1):
        team_name = row.get("team")
        if not team_name or pd.isna(team_name):
            continue

        team_id = team_map.get(team_name)
        if not team_id:
            logger.warning("[standings] Team '%s' not found in team_map, skipping", team_name)
            continue

        cur.execute("""
            INSERT INTO standing (
                season_id, team_id, position, played, won, drawn, lost,
                goals_for, goals_against, goal_difference, points,
                created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (season_id, team_id) DO UPDATE SET
                position = EXCLUDED.position, played = EXCLUDED.played,
                won = EXCLUDED.won, drawn = EXCLUDED.drawn, lost = EXCLUDED.lost,
                goals_for = EXCLUDED.goals_for, goals_against = EXCLUDED.goals_against,
                goal_difference = EXCLUDED.goal_difference, points = EXCLUDED.points,
                updated_at = CURRENT_TIMESTAMP;
        """, (
            season_id, team_id, position,
            safe_int(row.get("MP")), safe_int(row.get("W")),
            safe_int(row.get("D")), safe_int(row.get("L")),
            safe_int(row.get("GF")), safe_int(row.get("GA")),
            safe_int(row.get("GD")), safe_int(row.get("Pts")),
        ))
        count += 1

    logger.info("[standings] %d standings upserted", count)


def _standings_from_matches(cur, season_id):
    """Fallback: Calculate standings from finished matches."""
    cur.execute("""
        WITH team_stats AS (
            SELECT
                team_id,
                COUNT(*) as played,
                SUM(CASE WHEN home_score > away_score AND home_team_id = team_id THEN 1
                         WHEN away_score > home_score AND away_team_id = team_id THEN 1 ELSE 0 END) as won,
                SUM(CASE WHEN home_score = away_score THEN 1 ELSE 0 END) as drawn,
                SUM(CASE WHEN home_score < away_score AND home_team_id = team_id THEN 1
                         WHEN away_score < home_score AND away_team_id = team_id THEN 1 ELSE 0 END) as lost,
                SUM(CASE WHEN home_team_id = team_id THEN home_score ELSE away_score END) as goals_for,
                SUM(CASE WHEN home_team_id = team_id THEN away_score ELSE home_score END) as goals_against
            FROM "match"
            CROSS JOIN LATERAL (VALUES (home_team_id), (away_team_id)) AS t(team_id)
            WHERE status = 'FINISHED' AND season_id = %s
            GROUP BY team_id
        )
        SELECT
            team_id, played, won, drawn, lost, goals_for, goals_against,
            (goals_for - goals_against) AS goal_difference,
            ((won * 3) + drawn) AS points
        FROM team_stats
        ORDER BY points DESC, goal_difference DESC, goals_for DESC;
    """, (season_id,))

    standings_rows = cur.fetchall()
    for position, row in enumerate(standings_rows, start=1):
        cur.execute("""
            INSERT INTO standing (
                season_id, team_id, position, played, won, drawn, lost,
                goals_for, goals_against, goal_difference, points,
                created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (season_id, team_id) DO UPDATE SET
                position = EXCLUDED.position, played = EXCLUDED.played,
                won = EXCLUDED.won, drawn = EXCLUDED.drawn, lost = EXCLUDED.lost,
                goals_for = EXCLUDED.goals_for, goals_against = EXCLUDED.goals_against,
                goal_difference = EXCLUDED.goal_difference, points = EXCLUDED.points,
                updated_at = CURRENT_TIMESTAMP;
        """, (
            season_id, row["team_id"], position, row["played"], row["won"],
            row["drawn"], row["lost"], row["goals_for"], row["goals_against"],
            row["goal_difference"], row["points"],
        ))

    logger.info("[standings] %d standings calculated from matches", len(standings_rows))


def get_or_create_player(cur, name, team_id=None, position=None):
    """Get or create a player by name. Returns player_id.

    Looks up by name alone to avoid duplicates when a player transfers.
    Updates current_team_id and position if they changed.
    """
    if not name or pd.isna(name):
        return None

    name = str(name).strip()
    cur.execute("SELECT id, current_team_id, position FROM player WHERE name = %s", (name,))
    res = cur.fetchone()
    if res:
        updates = {}
        if team_id is not None and res["current_team_id"] != team_id:
            updates["current_team_id"] = team_id
        if position is not None and res["position"] != position:
            updates["position"] = position
        if updates:
            set_clause = ", ".join(f"{k} = %s" for k in updates)
            cur.execute(
                f'UPDATE player SET {set_clause}, updated_at = CURRENT_TIMESTAMP WHERE id = %s',
                (*updates.values(), res["id"]),
            )
        return res["id"]

    cur.execute("""
        INSERT INTO player (name, current_team_id, position, created_at, updated_at)
        VALUES (%s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id;
    """, (name, team_id, position))
    return cur.fetchone()["id"]


def stage_player_stats(cur, espn, season_id, team_map):
    """Stage 5: Fetch ESPN lineups and aggregate into player season stats."""
    logger.info("[player-stats] Fetching lineups from ESPN (1 request per match, may take a few minutes)...")

    try:
        lineups = espn.read_lineup()
    except Exception as e:
        logger.error("[player-stats] Failed to fetch lineups: %s", e)
        return

    if lineups.empty:
        logger.warning("[player-stats] No lineup data returned")
        return

    df = lineups.reset_index()
    logger.info("[player-stats] Processing %d player-match records...", len(df))

    # Aggregate per player per team
    # Key: (player_name, team_name) -> stats dict
    player_agg = defaultdict(lambda: {
        "position": None,
        "appearances": 0,
        "starts": 0,
        "minutes_played": 0,
        "goals": 0,
        "assists": 0,
        "yellow_cards": 0,
        "red_cards": 0,
    })

    for _, row in df.iterrows():
        player_name = row.get("player")
        team_name = row.get("team")
        if pd.isna(player_name) or pd.isna(team_name):
            continue

        sub_in = row.get("sub_in")
        # Skip players who didn't enter the match
        if pd.isna(sub_in):
            continue

        key = (str(player_name).strip(), str(team_name).strip())
        stats = player_agg[key]

        # Position (take first non-null)
        if stats["position"] is None:
            stats["position"] = map_espn_position(row.get("position"))

        # Appearances
        stats["appearances"] += 1

        # Starts
        if sub_in == "start":
            stats["starts"] += 1

        # Minutes estimation
        sub_out = row.get("sub_out")
        if sub_in == "start" and sub_out == "end":
            stats["minutes_played"] += 90
        elif sub_in == "start" and sub_out not in (None, "end"):
            try:
                stats["minutes_played"] += int(float(sub_out))
            except (ValueError, TypeError):
                stats["minutes_played"] += 90
        elif sub_in not in (None, "start", "end"):
            try:
                sub_in_min = int(float(sub_in))
                if sub_out == "end":
                    stats["minutes_played"] += max(0, 90 - sub_in_min)
                elif sub_out is not None:
                    stats["minutes_played"] += max(0, int(float(sub_out)) - sub_in_min)
                else:
                    stats["minutes_played"] += max(0, 90 - sub_in_min)
            except (ValueError, TypeError):
                pass

        # Accumulate match stats
        stats["goals"] += safe_int(row.get("goals")) or 0
        stats["assists"] += safe_int(row.get("assists")) or 0
        stats["yellow_cards"] += safe_int(row.get("yellow_cards")) or 0
        stats["red_cards"] += safe_int(row.get("red_cards")) or 0

    # Apply team name replacements and warn about unmatched ESPN team names
    resolved_map = _apply_team_replacements(team_map)
    espn_teams = set(team_name for (_, team_name) in player_agg.keys())
    unmatched = espn_teams - set(resolved_map.keys())
    if unmatched:
        logger.warning("[player-stats] %d ESPN team names not in team_map: %s",
                       len(unmatched), sorted(unmatched))
        _generate_replacement_stubs(unmatched)

    # Insert into DB
    count = 0
    for (player_name, team_name), stats in player_agg.items():
        team_id = resolved_map.get(team_name)
        if not team_id:
            logger.warning("[player-stats] Team '%s' not in team_map, skipping player '%s'",
                           team_name, player_name)
            continue

        player_id = get_or_create_player(cur, player_name, team_id, stats["position"])
        if not player_id:
            continue

        cur.execute("""
            INSERT INTO player_season_stats (
                player_id, season_id, team_id, appearances, starts, minutes_played,
                goals, assists, penalty_goals, yellow_cards, red_cards, xg, xag,
                created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (player_id, season_id, team_id) DO UPDATE SET
                appearances = EXCLUDED.appearances, starts = EXCLUDED.starts,
                minutes_played = EXCLUDED.minutes_played, goals = EXCLUDED.goals,
                assists = EXCLUDED.assists, penalty_goals = EXCLUDED.penalty_goals,
                yellow_cards = EXCLUDED.yellow_cards, red_cards = EXCLUDED.red_cards,
                xg = EXCLUDED.xg, xag = EXCLUDED.xag,
                updated_at = CURRENT_TIMESTAMP;
        """, (player_id, season_id, team_id,
              stats["appearances"], stats["starts"], stats["minutes_played"],
              stats["goals"], stats["assists"],
              0,  # penalty_goals not available from ESPN
              stats["yellow_cards"], stats["red_cards"],
              None, None))  # xg, xag not available
        count += 1

    logger.info("[player-stats] %d player season stats upserted", count)


def stage_team_stats(cur, espn, season_id, team_map):
    """Stage 6: Fetch ESPN match sheets and aggregate into team season stats."""
    logger.info("[team-stats] Fetching match sheets from ESPN (uses same cache as lineups)...")

    try:
        sheets = espn.read_matchsheet()
    except Exception as e:
        logger.error("[team-stats] Failed to fetch match sheets: %s", e)
        return

    if sheets.empty:
        logger.warning("[team-stats] No match sheet data returned")
        return

    df = sheets.reset_index()
    logger.info("[team-stats] Processing %d team-match records...", len(df))

    # Aggregate per team
    team_agg = defaultdict(lambda: {
        "matches": 0,
        "goals_scored": 0,
        "goals_conceded": 0,
        "clean_sheets": 0,
        "possession_sum": 0.0,
        "shots_sum": 0,
        "shots_on_target_sum": 0,
        "pass_accuracy_sum": 0.0,
        "fouls_sum": 0,
    })

    # We need to pair home/away teams per game to get goals conceded
    # Group by game first
    games = df.groupby("game")
    for _, game_df in games:
        if len(game_df) != 2:
            continue

        rows = game_df.to_dict("records")
        for i, row in enumerate(rows):
            opponent = rows[1 - i]
            team_name = row.get("team")
            if not team_name or pd.isna(team_name):
                continue

            stats = team_agg[str(team_name).strip()]
            stats["matches"] += 1

            # Possession
            poss = safe_float(row.get("possession"))
            if poss is not None:
                stats["possession_sum"] += poss

            # Shots
            shots = safe_int(row.get("shots"))
            if shots is not None:
                stats["shots_sum"] += shots

            sot = safe_int(row.get("shotson_target"))
            if sot is not None:
                stats["shots_on_target_sum"] += sot

            # Pass accuracy
            pa = safe_float(row.get("pass_accuracy"))
            if pa is not None:
                stats["pass_accuracy_sum"] += pa

            # Fouls
            fouls = safe_int(row.get("fouls_committed"))
            if fouls is not None:
                stats["fouls_sum"] += fouls

    # Apply team name replacements and warn about unmatched ESPN team names
    resolved_map = _apply_team_replacements(team_map)
    espn_teams = set(team_agg.keys())
    unmatched = espn_teams - set(resolved_map.keys())
    if unmatched:
        logger.warning("[team-stats] %d ESPN team names not in team_map: %s",
                       len(unmatched), sorted(unmatched))
        _generate_replacement_stubs(unmatched)

    # Get goals scored/conceded and clean sheets from match table
    for team_name in list(team_agg.keys()):
        team_id = resolved_map.get(team_name)
        if not team_id:
            logger.warning("[team-stats] Team '%s' not in team_map for goals lookup, skipping", team_name)
            continue

        cur.execute("""
            SELECT
                SUM(CASE WHEN home_team_id = %s THEN home_score ELSE away_score END) as goals_scored,
                SUM(CASE WHEN home_team_id = %s THEN away_score ELSE home_score END) as goals_conceded,
                SUM(CASE WHEN
                    (home_team_id = %s AND away_score = 0) OR
                    (away_team_id = %s AND home_score = 0)
                    THEN 1 ELSE 0 END) as clean_sheets
            FROM "match"
            WHERE season_id = %s AND status = 'FINISHED'
                AND (home_team_id = %s OR away_team_id = %s)
        """, (team_id, team_id, team_id, team_id, season_id, team_id, team_id))
        res = cur.fetchone()
        if res:
            team_agg[team_name]["goals_scored"] = res["goals_scored"] or 0
            team_agg[team_name]["goals_conceded"] = res["goals_conceded"] or 0
            team_agg[team_name]["clean_sheets"] = res["clean_sheets"] or 0

    # Insert into DB
    count = 0
    for team_name, stats in team_agg.items():
        team_id = resolved_map.get(team_name)
        if not team_id:
            logger.warning("[team-stats] Team '%s' not in team_map, skipping stats insert", team_name)
            continue

        mp = stats["matches"] or 1

        cur.execute("""
            INSERT INTO team_season_stats (
                team_id, season_id, goals_scored, goals_conceded, clean_sheets,
                avg_possession, shots_per_game, shots_on_target_per_game,
                pass_accuracy, tackles_per_game, interceptions, fouls_per_game,
                xg, xga, created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (team_id, season_id) DO UPDATE SET
                goals_scored = EXCLUDED.goals_scored,
                goals_conceded = EXCLUDED.goals_conceded,
                clean_sheets = EXCLUDED.clean_sheets,
                avg_possession = EXCLUDED.avg_possession,
                shots_per_game = EXCLUDED.shots_per_game,
                shots_on_target_per_game = EXCLUDED.shots_on_target_per_game,
                pass_accuracy = EXCLUDED.pass_accuracy,
                tackles_per_game = EXCLUDED.tackles_per_game,
                interceptions = EXCLUDED.interceptions,
                fouls_per_game = EXCLUDED.fouls_per_game,
                xg = EXCLUDED.xg, xga = EXCLUDED.xga,
                updated_at = CURRENT_TIMESTAMP;
        """, (
            team_id, season_id,
            stats["goals_scored"],
            stats["goals_conceded"],
            stats["clean_sheets"],
            round(stats["possession_sum"] / mp, 1) if stats["possession_sum"] else None,
            round(stats["shots_sum"] / mp, 1) if stats["shots_sum"] else None,
            round(stats["shots_on_target_sum"] / mp, 1) if stats["shots_on_target_sum"] else None,
            round(stats["pass_accuracy_sum"] / mp, 1) if stats["pass_accuracy_sum"] else None,
            None,  # tackles_per_game not available from matchsheet
            None,  # interceptions not available from matchsheet
            round(stats["fouls_sum"] / mp, 1) if stats["fouls_sum"] else None,
            None, None,  # xg, xga not available
        ))
        count += 1

    logger.info("[team-stats] %d team season stats upserted", count)


# ==========================================
# CLI
# ==========================================
def parse_args():
    parser = argparse.ArgumentParser(
        description="Populate the predictfootball database from SofaScore + ESPN data."
    )
    parser.add_argument(
        "--seasons", nargs="+", required=True,
        help="Season(s) to process in YYYY-YYYY format (e.g., 2025-2026)"
    )
    parser.add_argument(
        "--stages", nargs="+",
        choices=["all", "base", "teams", "matches", "standings", "player-stats", "team-stats"],
        default=None,
        help="Pipeline stages to run (default: base, teams, matches, standings)"
    )
    parser.add_argument(
        "--force-cache", action="store_true",
        help="Use cached data even for current season"
    )
    return parser.parse_args()


# ==========================================
# MAIN ORCHESTRATOR
# ==========================================
def main():
    args = parse_args()

    # Determine which stages to run
    if args.stages is None:
        stages = {"base", "teams", "matches", "standings"}
    elif "all" in args.stages:
        stages = {"base", "teams", "matches", "standings", "player-stats", "team-stats"}
    else:
        stages = set(args.stages)

    conn = connect_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        for season_str in args.seasons:
            logger.info("=" * 60)
            logger.info("Processing season: %s", season_str)
            logger.info("=" * 60)

            season_code = season_to_code(season_str)

            # Initialize scrapers as needed
            sofa = None
            espn = None

            if stages & {"teams", "matches", "standings"}:
                sofa = sd.Sofascore(leagues="POR-Primeira Liga", seasons=season_code)

            if stages & {"player-stats", "team-stats"}:
                espn = sd.ESPN(leagues="POR-Primeira Liga", seasons=season_code)

            # Stage 1: Base data
            if "base" in stages:
                country_id, _, season_id = stage_base(cur, season_str)
                conn.commit()
            else:
                cur.execute("SELECT id FROM country WHERE code = 'PRT'")
                country_id = cur.fetchone()["id"]
                cur.execute("SELECT id FROM competition WHERE code = 'POR-Primeira Liga'")
                competition_id = cur.fetchone()["id"]
                cur.execute("SELECT id FROM season WHERE competition_id = %s AND year = %s",
                            (competition_id, season_start_year(season_str)))
                season_id = cur.fetchone()["id"]

            # Fetch SofaScore schedule (needed for teams + matches)
            schedule = None
            if stages & {"teams", "matches"} and sofa:
                logger.info("Fetching schedule from SofaScore...")
                schedule = sofa.read_schedule(force_cache=args.force_cache)
                logger.info("Schedule: %d matches found", len(schedule))

            # Stage 2: Teams
            team_map = {}
            if "teams" in stages and schedule is not None:
                team_map = stage_teams(cur, schedule, country_id)
                conn.commit()
            else:
                cur.execute("SELECT id, name FROM team")
                for row in cur.fetchall():
                    team_map[row["name"]] = row["id"]

            # Stage 3: Matches
            if "matches" in stages and schedule is not None:
                stage_matches(cur, schedule, season_id, team_map)
                conn.commit()

            # Stage 4: Standings
            if "standings" in stages and sofa:
                stage_standings(cur, sofa, season_id, team_map, force_cache=args.force_cache)
                conn.commit()

            # Stage 5: Player stats (ESPN)
            if "player-stats" in stages and espn:
                stage_player_stats(cur, espn, season_id, team_map)
                conn.commit()

            # Stage 6: Team stats (ESPN)
            if "team-stats" in stages and espn:
                stage_team_stats(cur, espn, season_id, team_map)
                conn.commit()

        # Mark the latest processed season as current (only among processed seasons)
        if "base" in stages and args.seasons:
            cur.execute("SELECT id FROM competition WHERE code = 'POR-Primeira Liga'")
            comp_row = cur.fetchone()
            if comp_row:
                processed_years = [season_start_year(s) for s in args.seasons]
                latest_year = max(processed_years)
                # Only set current=false for seasons we processed, leave others untouched
                cur.execute("""
                    UPDATE season SET current = false, updated_at = CURRENT_TIMESTAMP
                    WHERE competition_id = %s AND year = ANY(%s)
                """, (comp_row["id"], processed_years))
                cur.execute("""
                    UPDATE season SET current = true, updated_at = CURRENT_TIMESTAMP
                    WHERE competition_id = %s AND year = %s
                """, (comp_row["id"], latest_year))
                conn.commit()
                logger.info("[base] Marked season %d as current", latest_year)

        logger.info("=" * 60)
        logger.info("Database population complete!")
        logger.info("=" * 60)

    except Exception as e:
        conn.rollback()
        logger.error("Pipeline failed: %s", e, exc_info=True)
        sys.exit(1)
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()
