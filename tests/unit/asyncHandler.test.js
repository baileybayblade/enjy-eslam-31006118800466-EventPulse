const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler Utility', () => {
  test('correctly invokes wrapped function with req, res, and next parameters', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const req = {};
    const res = {};
    const next = jest.fn();

    const wrappedFn = asyncHandler(fn);
    await wrappedFn(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test('catches thrown or rejected errors and passes them to next()', async () => {
    const testError = new Error('Test error');
    const fn = jest.fn().mockRejectedValue(testError);
    const req = {};
    const res = {};
    const next = jest.fn();

    const wrappedFn = asyncHandler(fn);
    await wrappedFn(req, res, next);

    expect(next).toHaveBeenCalledWith(testError);
  });
});