import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Home from '@/pages/index';
import { GET_TEST_QUERY } from '@/graphql/schemas/getTestQuery';

describe('Home', () => {
  const mocks = [
    {
      request: {
        query: GET_TEST_QUERY,
      },
      result: {
        data: [],
      },
    },
  ];

  it('should render components without crashing', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home />
      </MockedProvider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
