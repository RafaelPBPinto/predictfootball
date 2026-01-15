'use client';

import { useState } from 'react';
import { Fixture, FixtureStatus } from '@/src/types/fixture';
import FixtureCard from './FixtureCard';
import FixtureFilters from './FixtureFilters';

interface FixtureListProps {
    initialFixtures: Fixture[];
}

export default function FixtureList({ initialFixtures }: FixtureListProps) {
    const [fixtures] = useState<Fixture[]>(initialFixtures);
    const [filter, setFilter] = useState<FixtureStatus | 'ALL'>('ALL');

    const filteredFixtures = fixtures.filter(
        (f) => filter === 'ALL' || f.status === filter
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <FixtureFilters 
                currentFilter={filter} 
                onFilterChange={setFilter}
                liveCount={fixtures.filter(f => f.status === FixtureStatus.LIVE).length}
            />
            
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
                {filteredFixtures.map((fixture) => (
                    <FixtureCard key={fixture.id} fixture={fixture} />
                ))}
            </div>
        </div>
    );
}
