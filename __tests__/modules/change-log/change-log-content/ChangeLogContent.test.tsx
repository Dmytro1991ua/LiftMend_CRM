import { render, screen } from '@testing-library/react';

import ChangeLogContent from '@/modules/change-log/change-log-content';
import { ChangeLogFieldChange } from '@/shared/types';

describe('ChangeLogContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a single change log row', () => {
    const mockChangeList: ChangeLogFieldChange[] = [
      {
        field: 'status',
        oldValue: 'Unread',
        newValue: 'Read',
        action: 'update',
      },
    ];

    render(<ChangeLogContent changeList={mockChangeList} />);

    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('Unread')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('should render multiple change log rows', () => {
    const mockChangeList: ChangeLogFieldChange[] = [
      {
        field: 'status',
        oldValue: 'Unread',
        newValue: 'Read',
        action: 'update',
      },
      {
        field: 'readAt',
        oldValue: null,
        newValue: '2026-01-05T08:15:52.762Z',
        action: 'update',
      },
    ];

    render(<ChangeLogContent changeList={mockChangeList} />);

    // First row
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('Unread')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();

    // Second row
    expect(screen.getByText('readAt')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument(); // oldValue placeholder
    expect(screen.getByText('01/05/2026 10:15 AM')).toBeInTheDocument();

    // Actions
    const updates = screen.getAllByText('Update');
    expect(updates).toHaveLength(2);
  });

  it('should render empty old and new values as placeholder', () => {
    const mockChangeList: ChangeLogFieldChange[] = [
      {
        field: 'notes',
        oldValue: null,
        newValue: null,
        action: 'update',
      },
    ];

    render(<ChangeLogContent changeList={mockChangeList} />);

    expect(screen.getByText('notes')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(2);
  });
});
