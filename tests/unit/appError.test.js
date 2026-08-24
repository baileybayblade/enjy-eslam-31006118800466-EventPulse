const AppError = require('../../utils/appError');

describe('AppError Utility', () => {
  test('produces statusCode = 404 and status = "fail" for 4xx status codes', () => {
    const error = new AppError('Not found', 404);
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.message).toBe('Not found');
  });

  test('produces status = "error" for 5xx status codes', () => {
    const error = new AppError('Server error', 500);
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
  });

  test('isOperational property defaults to true', () => {
    const error = new AppError('Operational error', 400);
    expect(error.isOperational).toBe(true);
  });

  test('AppError is an instance of native JavaScript Error', () => {
    const error = new AppError('Test error', 400);
    expect(error).toBeInstanceOf(Error);
  });
});