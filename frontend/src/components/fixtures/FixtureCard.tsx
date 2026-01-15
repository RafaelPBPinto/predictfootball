import Link from 'next/link';
import { FaTrophy } from "react-icons/fa";
import { Fixture, FixtureStatus } from '@/src/types/fixture';
import Image from 'next/image';

interface FixtureCardProps {
    fixture: Fixture;
}

export default function FixtureCard({ fixture }: FixtureCardProps) {
    const isLive = fixture.status === FixtureStatus.LIVE;
    const isFinished = fixture.status === FixtureStatus.FINISHED;
    const isScheduled = fixture.status === FixtureStatus.SCHEDULED;

    const formatTime = (timeStr: string) => {
        const date = new Date(timeStr);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
    };

    const formatDate = (timeStr: string) => {
        const date = new Date(timeStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getStatusBadge = () => {
        switch (fixture.status) {
        case FixtureStatus.LIVE:
            return (
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-red-500">
                        {fixture.elapsed}&#39;
                    </span>
                </div>
            );
        case FixtureStatus.HALFTIME:
            return (
                <span className="text-xs font-medium text-orange-600">HT</span>
            );
        case FixtureStatus.FINISHED:
            return (
                <span className="text-xs font-medium text-gray-500">FT</span>
            );
        case FixtureStatus.POSTPONED:
            return (
                <span className="text-xs font-medium text-yellow-600">POSTP.</span>
            );
        case FixtureStatus.CANCELLED:
            return (
                <span className="text-xs font-medium text-red-600">CANC.</span>
            );
        default:
            return null;
        }
    };

    return (
        <Link href={`/fixtures/${fixture.id}`}>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                {/* League Header */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    {fixture.league.logo && (
                        <Image 
                            src={fixture.league.logo} 
                            alt={fixture.league.name}
                            className="w-5 h-5 object-contain"
                        />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                        {fixture.league.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        • {fixture.league.country}
                    </span>
                    {fixture.round && (
                        <span className="text-xs text-gray-400 ml-auto">
                            {fixture.round}
                        </span>
                    )}
                </div>

                {/* Match Content */}
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        {/* Home Team */}
                        <div className="flex-1 flex items-center gap-3">
                            {fixture.homeTeam.logo && (
                                <Image 
                                    src={fixture.homeTeam.logo}
                                    alt={fixture.homeTeam.name}
                                    className="w-8 h-8 object-contain"
                                />
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                    {fixture.homeTeam.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {fixture.homeTeam.shortName}
                                </p>
                            </div>
                        </div>

                        {/* Score/Time */}
                        <div className="px-6 text-center min-w-30">
                            {isScheduled ? (
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs text-gray-500 font-medium">
                                        {formatDate(fixture.kickoffTime)}
                                    </span>
                                    <span className="text-lg font-bold text-gray-700">
                                        {formatTime(fixture.kickoffTime)}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {fixture.homeScore}
                                        </span>
                                        <span className="text-2xl font-light text-gray-400">-</span>
                                        <span className="text-3xl font-bold text-gray-900">
                                            {fixture.awayScore}
                                        </span>
                                    </div>
                                    <div className="mt-1">
                                        {getStatusBadge()}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex-1 flex items-center gap-3 flex-row-reverse">
                            {fixture.awayTeam.logo && (
                                <Image 
                                    src={fixture.awayTeam.logo}
                                    alt={fixture.awayTeam.name}
                                    className="w-8 h-8 object-contain"
                                />
                            )}
                            <div className="flex-1 text-right">
                                <p className="font-semibold text-gray-900">
                                    {fixture.awayTeam.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {fixture.awayTeam.shortName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Venue */}
                    {fixture.venue && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-1 text-xs text-gray-500">
                            <FaTrophy className="w-3 h-3" />
                            <span>{fixture.venue}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
