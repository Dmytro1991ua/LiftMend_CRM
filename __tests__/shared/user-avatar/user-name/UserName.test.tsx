import { render, screen } from '@testing-library/react';

import UserName, { UserNameProps } from '@/shared/user-avatar/user-name/UserName';

describe('UserName', () => {
  const mockFirstName = 'Alex';
  const mockLastName = 'Smith';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    firstName: '',
    lastName: '',
    skeletonClassName: '',
    nameClassName: '',
    isLoading: false,
  };

  const UserNameComponent = (props?: Partial<UserNameProps>) => <UserName {...defaultProps} {...props} />;

  it('should render skeleton if isLoading is true', () => {
    render(UserNameComponent({ isLoading: true }));

    expect(screen.getByTestId('user-name-skeleton')).toBeInTheDocument();
  });

  it('should render first name if provided', () => {
    render(UserNameComponent({ firstName: mockFirstName }));

    expect(screen.getByText(mockFirstName)).toBeInTheDocument();
  });

  it('should render first name if provided', () => {
    render(UserNameComponent({ lastName: mockLastName }));

    expect(screen.getByText(mockLastName)).toBeInTheDocument();
  });

  it('should render both: first and last names if they are provided', () => {
    render(UserNameComponent({ firstName: mockFirstName, lastName: mockLastName }));

    expect(screen.getByText(`${mockFirstName} ${mockLastName}`)).toBeInTheDocument();
  });
});
