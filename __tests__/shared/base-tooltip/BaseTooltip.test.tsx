import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseTooltip from '@/shared/base-tooltip';
import { BaseTooltipProps } from '@/shared/base-tooltip/BaseTooltip';

describe('<BaseTooltip />', () => {
  const targetElementText = 'Target Element';
  const toolTipText = 'to brush your teeth, squeeze the toothpaste tube and apply';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: BaseTooltipProps = {
    id: 'id1',
    children: <div>{targetElementText}</div>,
    message: toolTipText,
    shouldRenderInPortal: false,
  };

  const BaseTooltipComponent = (props?: Partial<BaseTooltipProps>) => <BaseTooltip {...defaultProps} {...props} />;

  it('should show the tooltip content on hover', async () => {
    render(BaseTooltipComponent());

    expect(screen.queryByText(toolTipText)).not.toBeInTheDocument();

    const targetElement = screen.getByText(targetElementText);

    await userEvent.hover(targetElement);

    // The tooltip is always on the DOM, but is hidden when not visible
    await waitFor(() => expect(screen.getByText(toolTipText)).toBeVisible());
  });

  it('should render tooltip in React Portal when shouldRenderInPortal is true', async () => {
    render(
      BaseTooltipComponent({
        shouldRenderInPortal: true,
      })
    );

    await screen.findByTestId('body-portal');
  });

  it('should render tooltip outside of React Portal when shouldRenderInPortal is false', async () => {
    render(BaseTooltipComponent());

    await waitFor(() => expect(screen.queryByTestId('body-portal')).not.toBeInTheDocument());
  });

  it('should not show tooltip when disabled is true', async () => {
    render(
      BaseTooltipComponent({
        disable: true,
      })
    );
    expect(screen.queryByText(toolTipText)).not.toBeInTheDocument();

    const targetElement = screen.getByText(targetElementText);

    await userEvent.hover(targetElement);

    // The tooltip is always on the DOM, but is hidden when not visible
    await waitFor(() => expect(screen.queryByText(toolTipText)).not.toBeVisible());
  });
});
