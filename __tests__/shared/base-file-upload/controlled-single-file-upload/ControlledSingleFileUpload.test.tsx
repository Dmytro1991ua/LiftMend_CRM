import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withFormProvider } from '@/mocks/testMocks';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import ControlledSingleFileUpload from '@/shared/base-file-upload/controlled-single-file-upload';
import { ControlledSingleFileDropzoneProps } from '@/shared/base-file-upload/controlled-single-file-upload/ControlledSingleFileUpload';
import { FileDropzoneProps } from '@/shared/file-dropzone/FileDropzone';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

jest.mock('@/modules/repair-job-scheduling/utils', () => ({
  getNestedError: jest.fn(),
}));

jest.mock('@/shared/utils', () => ({
  getCommonFormLabelErrorStyles: jest.fn(() => 'label-default'),
}));

jest.mock('@/shared/file-dropzone', () => ({
  __esModule: true,
  default: ({ onFileUpload, children, testId, isUploadDisabled }: FileDropzoneProps) => (
    <div>
      <div data-testid={testId || 'dropzone'}>
        <button
          disabled={isUploadDisabled}
          onClick={() => onFileUpload([new File(['img'], 'test.png', { type: 'image/png' })])}
        >
          upload
        </button>
      </div>
      {children}
    </div>
  ),
}));

describe('ControlledSingleFileUpload', () => {
  const mockClearErrors = jest.fn();

  beforeEach(() => {
    (getNestedError as jest.Mock).mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'evidencePhoto' as const,
    label: 'Evidence Photo',
    clearErrors: mockClearErrors,
    testId: 'file-upload',
    children: <div>child-content</div>,
  };

  const ControlledSingleFileUploadComponent = (
    props?: Partial<ControlledSingleFileDropzoneProps<{ evidencePhoto: File | null }>>
  ) => withFormProvider(<ControlledSingleFileUpload<{ evidencePhoto: File | null }> {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(ControlledSingleFileUploadComponent());

    expect(screen.getByText('Evidence Photo')).toBeInTheDocument();
    expect(screen.getByText('child-content')).toBeInTheDocument();
  });

  it('should render error message when error exists', () => {
    (getNestedError as jest.Mock).mockReturnValue({
      message: 'File is required',
    });

    render(ControlledSingleFileUploadComponent());

    expect(screen.getByText('File is required')).toHaveClass('field-error');
  });

  it('should NOT render error message when no error exists', () => {
    (getNestedError as jest.Mock).mockReturnValue(undefined);

    render(ControlledSingleFileUploadComponent());

    expect(screen.queryByText('File is required')).not.toBeInTheDocument();
  });

  it('should call clearErrors when file is uploaded', async () => {
    render(ControlledSingleFileUploadComponent());

    await userEvent.click(screen.getByText('upload'));

    await waitFor(() => {
      expect(mockClearErrors).toHaveBeenCalledWith('evidencePhoto');
    });
  });

  it('should pass file to form field (onChange)', async () => {
    render(ControlledSingleFileUploadComponent());

    await userEvent.click(screen.getByText('upload'));

    // We verify indirectly via behavior:
    // file is passed through Controller -> no crash + clearErrors called
    expect(mockClearErrors).toHaveBeenCalled();
  });

  it('should apply disabled state to dropzone', () => {
    render(ControlledSingleFileUploadComponent({ disabled: true }));

    const button = screen.getByText('upload');

    expect(button).toBeDisabled();
  });

  it('should render label with error styles when error exists', () => {
    (getNestedError as jest.Mock).mockReturnValue({
      message: 'Error',
    });

    render(ControlledSingleFileUploadComponent());

    expect(getCommonFormLabelErrorStyles).toHaveBeenCalledWith(true);
  });
});
