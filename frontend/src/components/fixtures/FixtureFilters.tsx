'use client';

import { FixtureStatus } from "@/src/types/fixture";

interface FixtureFiltersProps {
    currentFilter: FixtureStatus | 'ALL';
    onFilterChange: (filter: FixtureStatus | 'ALL') => void;
    liveCount: number;
}

export default function FixtureFilters({
    currentFilter,
    onFilterChange,
    liveCount,
}: FixtureFiltersProps) {
    const filters: Array<{ value: FixtureStatus | 'ALL'; label: string }> = [
        { value: 'ALL', label: 'All' },
        { value: FixtureStatus.LIVE, label: 'Live' },
        { value: FixtureStatus.SCHEDULED, label: 'Upcoming' },
        { value: FixtureStatus.FINISHED, label: 'Finished' },
    ];

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => onFilterChange(filter.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                currentFilter === filter.value
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {filter.label}
                            {filter.value === FixtureStatus.LIVE && liveCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                    {liveCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
