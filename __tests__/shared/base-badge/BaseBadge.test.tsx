import { render, screen } from '@testing-library/react';

import Badge from '@/shared/badge';

describe('BaseBadge', () => {
  const defaultProps = {
    items: ['Skill 1', 'Skill 2'],
    bgColor: 'green',
  };

  it('should render component without crashing', () => {
    render(<Badge {...defaultProps} />);

    const skill1 = screen.getByText('Skill 1');
    const skill2 = screen.getByText('Skill 2');

    expect(skill1).toBeInTheDocument();
    expect(skill2).toBeInTheDocument();

    expect(skill1).toHaveClass('green');
    expect(skill2).toHaveClass('green');
  });
});
