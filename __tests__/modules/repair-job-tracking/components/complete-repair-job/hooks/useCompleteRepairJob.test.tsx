import { Readable } from 'stream';

import { act, renderHook } from '@testing-library/react-hooks';

import { mockFormState } from '@/mocks/formStateMock';
import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { useCompleteRepairJob } from '@/modules/repair-job-tracking/components/complete-repair-job/hooks';
import { useFormState, useModal } from '@/shared/hooks';
import { useUpdateRepairJob, useUploadRepairJobEvidencePhoto } from '@/shared/repair-job/hooks';

jest.mock('@/shared/hooks', () => ({
  ...jest.requireActual('@/shared/hooks'),
  useFormState: jest.fn(),
  useModal: jest.fn(),
}));

jest.mock('@/shared/repair-job/hooks', () => ({
  ...jest.requireActual('@/shared/repair-job/hooks'),
  useUpdateRepairJob: jest.fn(),
  useUploadRepairJobEvidencePhoto: jest.fn(),
}));

describe('useCompleteRepairJob', () => {
  const mockOnReset = jest.fn();
  const mockOnOpenModal = jest.fn();
  const mockOnCloseModal = jest.fn();
  const mockOnCompleteRepairJob = jest.fn();
  const mockOnFileUpload = jest.fn().mockImplementation(async (files, cb) => {
    files.forEach((file: File) => cb(file));
  });

  const createMockUploadFile = (filename = 'evidence-photo.png', content = 'fake-image-content') =>
    Promise.resolve({
      filename,
      mimetype: 'image/png',
      encoding: '7bit',
      createReadStream: () => Readable.from(Buffer.from(content)),
    });

  const mockFile = createMockUploadFile('before-photo.png') as unknown as File;

  beforeEach(() => {
    (useFormState as jest.Mock).mockReturnValue({
      formState: mockFormState,
      onReset: mockOnReset,
    });

    (useModal as jest.Mock).mockReturnValue({
      isModalOpen: false,
      onOpenModal: mockOnOpenModal,
      onCloseModal: mockOnCloseModal,
    });

    (useUpdateRepairJob as jest.Mock).mockReturnValue({
      onCompleteRepairJob: mockOnCompleteRepairJob,
      isLoading: false,
    });

    (useUploadRepairJobEvidencePhoto as jest.Mock).mockReturnValue({
      onFileUpload: mockOnFileUpload,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () =>
    renderHook(() => useCompleteRepairJob(mockRepairJob), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });

  it('should return correct initial data ', () => {
    const { result } = hook();

    expect(result.current.isLoading).toEqual(false);
    expect(result.current.isModalOpen).toEqual(false);
  });

  it('should opens modal when complete button clicked', () => {
    const { result } = hook();

    act(() => {
      result.current.onOpenModal();
    });

    expect(mockOnOpenModal).toHaveBeenCalled();
  });

  it('should close modal and reset form', () => {
    const { result } = hook();

    act(() => {
      result.current.onHandleCloseModal();
    });

    expect(mockOnCloseModal).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('should submit checklist and photo evidence and closes modal on success', async () => {
    mockOnCompleteRepairJob.mockResolvedValue({
      data: {
        updateRepairJob: mockRepairJob,
      },
      errors: [],
    });

    const { result } = hook();

    const values = {
      checklist: [{ id: 'a', label: 'Check motor', checked: true }],
      evidencePhoto: mockFile,
    };

    await act(async () => {
      await result.current.onHandleComplete(values);
    });

    expect(mockOnCompleteRepairJob).toHaveBeenCalledWith({
      ...mockRepairJob,
      checklist: values.checklist,
    });

    expect(mockOnCloseModal).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
    expect(mockOnFileUpload).toHaveBeenCalled();
  });

  it('should not close modal if API returns errors', async () => {
    mockOnCompleteRepairJob.mockResolvedValue({
      errors: ['validation failed'],
    });

    const { result } = hook();

    await act(async () => {
      await result.current.onHandleComplete({ checklist: [], evidencePhoto: null });
    });

    expect(mockOnCompleteRepairJob).toHaveBeenCalled();
    expect(mockOnCloseModal).not.toHaveBeenCalled();
    expect(mockOnReset).not.toHaveBeenCalled();
  });
});
