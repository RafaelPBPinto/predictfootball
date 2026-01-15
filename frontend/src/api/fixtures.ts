import apiClient from './client';
import { Fixture, FixtureStatus } from '../types/fixture';

export const fixturesApi = {
    // Get all fixtures
    getAll: async (): Promise<Fixture[]> => {
        const { data } = await apiClient.get('/fixtures');
        return data;
    },

    // Get fixture by ID
    getById: async (id: number): Promise<Fixture> => {
        const { data } = await apiClient.get(`/fixtures/${id}`);
        return data;
    },

    // Get fixtures by league
    getByLeague: async (leagueId: number): Promise<Fixture[]> => {
        const { data } = await apiClient.get(`/fixtures/league/${leagueId}`);
        return data;
    },

    // Get fixtures by team
    getByTeam: async (teamId: number): Promise<Fixture[]> => {
        const { data } = await apiClient.get(`/fixtures/team/${teamId}`);
        return data;
    },

    // Get fixtures by status
    getByStatus: async (status: FixtureStatus): Promise<Fixture[]> => {
        const { data } = await apiClient.get(`/fixtures/status/${status}`);
        return data;
    },

    // Get live fixtures
    getLive: async (): Promise<Fixture[]> => {
        const { data } = await apiClient.get('/fixtures/live');
        return data;
    },
};
