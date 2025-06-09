import { act, renderHook } from '@testing-library/react-hooks';

import useDetailsPageModals from '@/shared/base-details-page/hooks/useDetailsPageModals';

describe('useDetailsPageModals', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () => renderHook(() => useDetailsPageModals());

  it('should render correct initial hook data', () => {
    const { result } = hook();

    expect(result.current.isDeleteModalOpen).toBe(false);
    expect(result.current.isEditModalOpen).toBe(false);
  });

  it('should handle isEditModalOpen state when onOpenEditModal or onCloseEditModal are triggered', () => {
    const { result } = hook();

    act(() => result.current.onOpenEditModal());

    expect(result.current.isEditModalOpen).toBe(true);

    act(() => result.current.onCloseEditModal());

    expect(result.current.isEditModalOpen).toBe(false);
  });

  it('should handle isDeleteModalOpen state when onOpenDeleteModal or onCloseDeleteModal are triggered', () => {
    const { result } = hook();

    act(() => result.current.onOpenDeleteModal());

    expect(result.current.isDeleteModalOpen).toBe(true);

    act(() => result.current.onCloseDeleteModal());

    expect(result.current.isDeleteModalOpen).toBe(false);
  });
});
