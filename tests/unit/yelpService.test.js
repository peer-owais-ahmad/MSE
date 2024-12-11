const { searchPlaces } = require('../../src/services/yelpService');
const { searchYelp, searchYelpForCombo } = require('../../src/repositories/yelpRepository');
const Place = require('../../src/models/place');
const logger = require('../../src/utils/logger');

// Mock the logger to suppress logs during tests
jest.mock('../../src/utils/logger');

// Mock the repository methods (searchYelp and searchYelpForCombo)
jest.mock('../../src/repositories/yelpRepository');

// Mock the Place model
jest.mock('../../src/models/place');

describe('searchPlaces', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should search places with a term and return a list of places', async () => {
    const mockTerm = 'restaurant';
    const mockBusinesses = [
      { name: 'Restaurant A', location: { address1: '123 Main St' }, rating: 4.5, phone: '123-456-7890' },
      { name: 'Restaurant B', location: { address1: '456 Side St' }, rating: 4.0, phone: '987-654-3210' },
    ];

    // Mock the searchYelp function to return mock data
    searchYelp.mockResolvedValue(mockBusinesses);

    // Mock the Place constructor to return a mock place
    Place.mockImplementation(business => ({
      name: business.name,
      address: business.location?.address1 || 'No address provided',
      rating: business.rating || 0,
      phone: business.phone || 'No phone number',
    }));

    const places = await searchPlaces(mockTerm);

    expect(searchYelp).toHaveBeenCalledWith(mockTerm);
    expect(places.length).toBeGreaterThan(0); // Ensure we have results
    expect(places[0].name).toBe('Restaurant A');
    expect(places[1].name).toBe('Restaurant B');
  });

  it('should fall back to combo search if no term is provided', async () => {
    const mockBusinesses = [
      { name: 'Combo Place A', location: { address1: '789 Combo St' }, rating: 4.2, phone: '555-555-5555' },
    ];

    // Mock the searchYelpForCombo function to return mock data
    searchYelpForCombo.mockResolvedValue(mockBusinesses);

    // Mock the Place constructor to return a mock place
    Place.mockImplementation(business => ({
      name: business.name,
      address: business.location?.address1 || 'No address provided',
      rating: business.rating || 0,
      phone: business.phone || 'No phone number',
    }));

    const places = await searchPlaces();

    expect(searchYelpForCombo).toHaveBeenCalled();
    expect(places.length).toBeGreaterThan(0); // Ensure we have results
    expect(places[0].name).toBe('Combo Place A');
  });

  it('should return an empty array if no businesses are found', async () => {
    const mockTerm = 'nonexistent';
    searchYelp.mockResolvedValue([]);

    const places = await searchPlaces(mockTerm);

    expect(logger.warn).toHaveBeenCalledWith('No businesses found for the given term or location.');
    expect(places.length).toBe(0); // Explicitly check for empty array
  });

  it('should handle errors gracefully and return an empty array', async () => {
    const mockTerm = 'restaurant';
    const errorMessage = 'API error';

    // Mock the searchYelp function to throw an error
    searchYelp.mockRejectedValue(new Error(errorMessage));

    const places = await searchPlaces(mockTerm);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error in searchPlaces for term: restaurant'),
      expect.objectContaining({ stack: expect.any(String) })
    );
    expect(places.length).toBe(0); // Explicitly check for empty array
  });

  it('should log a warning for incomplete business data', async () => {
    const mockTerm = 'restaurant';
    const mockBusinesses = [
      { name: 'Incomplete Place', location: null, rating: 4.5, phone: '123-456-7890' }, // Invalid data
    ];

    // Mock the searchYelp function to return mock data
    searchYelp.mockResolvedValue(mockBusinesses);

    const places = await searchPlaces(mockTerm);

    expect(logger.warn).toHaveBeenCalledWith('Incomplete business data encountered, skipping.');
    expect(places.length).toBe(0); // Explicitly check for empty array
  });
});
