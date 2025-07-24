import { act, renderHook } from '@testing-library/react-hooks';
import { useRouter } from 'next/router';

import { useNavigationLoading } from '@/shared/hooks';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('useNavigationLoading', () => {
  let routerEvents: {
    on: jest.Mock;
    off: jest.Mock;
    emit: (event: string) => void;
  };

  beforeEach(() => {
    jest.useFakeTimers();

    routerEvents = {
      on: jest.fn(),
      off: jest.fn(),
      emit(event: string) {
        this.on.mock.calls.forEach(([evt, handler]) => {
          if (evt === event) handler();
        });
      },
    };

    (useRouter as jest.Mock).mockReturnValue({
      events: routerEvents,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  const hook = () => renderHook(() => useNavigationLoading());

  it('should return correct initial hook data', () => {
    const { result } = hook();

    expect(result.current).toBe(false);
  });

  it('should set loading to true after LOADER_DELAY on routeChangeStart', () => {
    const { result } = hook();

    act(() => {
      // simulate routeChangeStart event firing
      routerEvents.emit('routeChangeStart');
    });

    expect(result.current).toBe(false);

    // Fast-forward time past LOADER_DELAY (150ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current).toBe(true);
  });

  it('should clear start timeout and not show loader if routeChangeComplete happens quickly', () => {
    const { result } = hook();

    act(() => {
      routerEvents.emit('routeChangeStart');
    });

    expect(result.current).toBe(false);

    act(() => {
      // routeChangeComplete before LOADER_DELAY expires
      routerEvents.emit('routeChangeComplete');
    });

    expect(result.current).toBe(false);
  });

  it('should keep loader visible for MIN_LOADER_TIME after routeChangeComplete if loading was true', () => {
    const { result } = hook();

    act(() => {
      routerEvents.emit('routeChangeStart');
      jest.advanceTimersByTime(150); // LOADER_DELAY to show loader
    });
    expect(result.current).toBe(true);

    // Route change complete triggers loader hide delay
    act(() => {
      routerEvents.emit('routeChangeComplete');
    });

    // Loader still true immediately after complete, due to MIN_LOADER_TIME delay
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(300); // MIN_LOADER_TIME
    });

    // Loader hidden after minimum time passed
    expect(result.current).toBe(false);
  });

  it('should handle routeChangeError same as routeChangeComplete', () => {
    const { result } = hook();

    // Start loading
    act(() => {
      routerEvents.emit('routeChangeStart');
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe(true);

    // Route change error triggers hide delay
    act(() => {
      routerEvents.emit('routeChangeError');
    });

    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(false);
  });

  it('should clean up timers and event listeners on unmount', () => {
    const { unmount } = hook();

    expect(routerEvents.on).toHaveBeenCalledTimes(3);

    unmount();

    expect(routerEvents.off).toHaveBeenCalledTimes(3);
  });
});
