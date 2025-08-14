// Global test setup
import 'jest-fetch-mock';
import fetchMock from 'jest-fetch-mock';

// Mock fetch globally
global.fetch = fetchMock;

// Increase timeout for API tests
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 