import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Accordion } from '@/components/ui/accordion';
import ChangeLogItem, { ChangeLogItemProps } from '@/modules/change-log/change-log-item/ChangeLogItem';

describe('ChangeLogItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    id: 'test-id',
    createdAt: '2026-01-05T08:15:52.762Z',
    modifiedBy: 'test_user',
    entityType: 'RepairJob',
  };

  const ChangeLogItemComponent = (props?: Partial<ChangeLogItemProps>) => (
    <Accordion collapsible type='single'>
      <ChangeLogItem {...defaultProps} {...props}>
        <p>Mock Change Log Content</p>
      </ChangeLogItem>
    </Accordion>
  );

  it('should render component without crashing', async () => {
    render(ChangeLogItemComponent());

    const button = screen.getByRole('button');

    expect(screen.getByTestId('change-log-item')).toBeInTheDocument();
    expect(screen.getByText(/01\/05\/2026 10:15 AM/)).toBeInTheDocument();
    expect(screen.getByText(/test_user/)).toBeInTheDocument();

    await userEvent.click(button);

    expect(screen.getByText('Mock Change Log Content')).toBeInTheDocument();
  });
});
