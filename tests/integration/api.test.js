const request = require('supertest');
const app = require('../../app'); // Import the app for testing
jest.mock('../../src/utils/logger'); // Mock logger to avoid logging during tests

// Setup server for each test to avoid port conflict
let server;
beforeAll(() => {
  server = app.listen(4000);
});

afterAll(() => {
  server.close(); // Close the server after all tests
});

// Describe block for the API tests
describe('API Tests', () => {
  let searchPlacesMock;
  
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    searchPlacesMock = jest.spyOn(require('../../src/services/yelpService'), 'searchPlaces');
  });

  afterEach(() => {
    searchPlacesMock.mockRestore(); // Restore original implementation
  });


  it('should return 200 and list pizza places with valid structure', async () => {
    const mockPizzaPlaces = [
      { name: 'Pizza Place A', address: '123 Pizza St', rating: 4.5, phone: '555-555-5555' },
      { name: 'Pizza Place B', address: '456 Pizza Ave', rating: 4.0, phone: '555-555-5556' }
    ];

    searchPlacesMock.mockResolvedValueOnce(mockPizzaPlaces);

    const response = await request(app).get('/search/pizza?location=San Francisco');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(0);
    response.body.forEach(place => {
      expect(typeof place.name).toBe('string');
      expect(typeof place.address).toBe('string');
      expect(typeof place.rating).toBe('number');
      expect(typeof place.phone).toBe('string');
    });
  });

  it('should return 200 and list juice places with valid structure', async () => {
    const mockJuicePlaces = [
      { name: 'Juice Bar A', address: '123 Juice St', rating: 4.5, phone: '555-666-5555' },
      { name: 'Juice Bar B', address: '456 Juice Ave', rating: 4.0, phone: '555-666-5556' }
    ];

    searchPlacesMock.mockResolvedValueOnce(mockJuicePlaces);

    const response = await request(app).get('/search/juice?location=San Francisco');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(0);
    response.body.forEach(place => {
      expect(typeof place.name).toBe('string');
      expect(typeof place.address).toBe('string');
      expect(typeof place.rating).toBe('number');
      expect(typeof place.phone).toBe('string');
    });
  });

  it('should return 400 for missing location in the pizza request', async () => {
    const response = await request(app).get('/search/pizza');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Location is required');
  });

  it('should return 400 for missing location in the juice request', async () => {
    const response = await request(app).get('/search/juice');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Location is required');
  });
});
