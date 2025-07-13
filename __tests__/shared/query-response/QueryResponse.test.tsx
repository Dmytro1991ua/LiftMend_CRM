import { render, screen } from '@testing-library/react';

import { useToast } from '@/components/ui/use-toast';
import { useBaseToast } from '@/shared/hooks';
import QueryResponse from '@/shared/query-response';
import { QueryResponseProps } from '@/shared/query-response/QueryResponse';

jest.mock('@/shared/hooks', () => ({
  useBaseToast: jest.fn(() => ({
    baseToast: jest.fn(),
  })),
}));

describe('QueryResponse', () => {
  const mockBaseToast = jest.fn();
  const mockLoadingComponentContent = 'Test Loading Component Content';
  const mockErrorComponentContent = 'Test Error Component Content';
  const mockErrorMessage = 'Test Error Message';
  const mockErrorDescription = 'Test Error Description';
  const mockLoadingComponent = <p>{mockLoadingComponentContent}</p>;
  const mockErrorComponent = <p>{mockErrorComponentContent}</p>;

  beforeEach(() => {
    (useBaseToast as jest.Mock).mockReturnValue({
      baseToast: mockBaseToast,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    loading: false,
    loadingComponent: undefined,
    errorComponent: undefined,
    errorMessage: '',
    errorDescription: '',
    isErrorOccurred: false,
  };

  const QueryResponseResponse = (props?: Partial<QueryResponseProps>) => <QueryResponse {...defaultProps} {...props} />;

  it('should not render component if all props are null or undefined', () => {
    const { container } = render(QueryResponseResponse());

    expect(container).toBeEmptyDOMElement();
  });

  it('should render loading component when it is provided and loading is true', () => {
    render(QueryResponseResponse({ loading: true, loadingComponent: mockLoadingComponent }));

    expect(screen.getByText(mockLoadingComponentContent));
  });

  it('should render error component when it is provided and isErrorOccurred is true', () => {
    render(QueryResponseResponse({ isErrorOccurred: true, errorComponent: mockErrorComponent }));

    expect(screen.getByText(mockErrorComponentContent));
  });

  it('should show error alert when error component is not provided,isErrorOccurred is true and errorMessage or errorDescription are presented', () => {
    render(
      QueryResponseResponse({
        isErrorOccurred: true,
        errorMessage: mockErrorMessage,
        errorDescription: mockErrorDescription,
        errorComponent: undefined,
      })
    );

    expect(mockBaseToast).toHaveBeenCalledWith(mockErrorMessage, mockErrorDescription);
  });
});
