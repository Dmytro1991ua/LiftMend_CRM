import { logError } from '@/shared/utils';

describe('logErrorBoundary', () => {
  it('should call console error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    logError(new Error('some error'), { componentStack: 'stack' });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
  });
});
