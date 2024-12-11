process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../app');
const { searchPlaces } = require('../../src/services/yelpService');

// Mock the searchPlaces function
jest.mock('../../src/services/yelpService');

describe('GET /search', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear previous mocks before each test
    });

    it('should return a valid response for pizza shops', async () => {
        const mockLocation = 'San Francisco';
        const mockPizzaPlaces = [
            { name: 'Place 1', address: 'Address 1', rating: 4.5, phone: '555-555-5555' },
            { name: 'Place 2', address: 'Address 2', rating: 4.0, phone: '555-555-5556' }
        ];

        // Mock pizza search
        searchPlaces.mockResolvedValueOnce(mockPizzaPlaces);

        const response = await request(app).get(`/search/pizza?location=${mockLocation}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((place) => {
            expect(typeof place.name).toBe('string');
            expect(typeof place.address).toBe('string');
            expect(typeof place.rating).toBe('number');
            expect(typeof place.phone).toBe('string');
        });
    });

    it('should return a valid response for juice shops', async () => {
        const mockLocation = 'San Francisco';
        const mockJuicePlaces = [
            { name: 'Place 1', address: 'Address 1', rating: 4.5, phone: '555-666-5555' },
            { name: 'Place 2', address: 'Address 2', rating: 4.0, phone: '555-666-5556' }
        ];

        // Mock juice search
        searchPlaces.mockResolvedValueOnce(mockJuicePlaces);

        const response = await request(app).get(`/search/juice?location=${mockLocation}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((place) => {
            expect(typeof place.name).toBe('string');
            expect(typeof place.address).toBe('string');
            expect(typeof place.rating).toBe('number');
            expect(typeof place.phone).toBe('string');
        });
    });

    it('should return a valid response for combo shops', async () => {
        const mockLocation = 'San Francisco';
        const mockPizzaPlaces = [
            { name: 'Place 1', address: 'Address 1', rating: 4.5, phone: '555-555-5555' },
            { name: 'Place 2', address: 'Address 2', rating: 4.0, phone: '555-555-5556' }
        ];
        const mockJuicePlaces = [
            { name: 'Place 3', address: 'Address 3', rating: 4.5, phone: '555-666-5555' },
            { name: 'Place 1', address: 'Address 1', rating: 4.5, phone: '555-555-5555' } // Common place
        ];

        // Mock pizza and juice search
        searchPlaces.mockResolvedValueOnce(mockPizzaPlaces); // Pizza places
        searchPlaces.mockResolvedValueOnce(mockJuicePlaces); // Juice places

        const response = await request(app).get(`/search/combo?location=${mockLocation}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((place) => {
            expect(typeof place.name).toBe('string');
            expect(typeof place.address).toBe('string');
            expect(typeof place.rating).toBe('number');
            expect(typeof place.phone).toBe('string');
        });
    });

    it('should return a valid response for combo shops when no common places exist', async () => {
        const mockLocation = 'San Francisco';
        const mockPizzaPlaces = [
            { name: 'Place 1', address: 'Address 1', rating: 4.5, phone: '555-555-5555' },
            { name: 'Place 2', address: 'Address 2', rating: 4.0, phone: '555-555-5556' }
        ];
        const mockJuicePlaces = [
            { name: 'Place 3', address: 'Address 3', rating: 4.5, phone: '555-666-5555' },
            { name: 'Place 4', address: 'Address 4', rating: 4.0, phone: '555-666-5556' }
        ];

        // Mock pizza and juice search
        searchPlaces.mockResolvedValueOnce(mockPizzaPlaces); // Pizza places
        searchPlaces.mockResolvedValueOnce(mockJuicePlaces); // Juice places

        const response = await request(app).get(`/search/combo?location=${mockLocation}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((place) => {
            expect(typeof place.name).toBe('string');
            expect(typeof place.address).toBe('string');
            expect(typeof place.rating).toBe('number');
            expect(typeof place.phone).toBe('string');
        });
    });

    it('should return 400 when location is missing', async () => {
        const response = await request(app).get('/search/pizza');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Location is required');
    });
});
