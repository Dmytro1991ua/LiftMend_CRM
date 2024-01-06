import { useQuery } from '@apollo/client';
import React from 'react';

import { GET_TEST_QUERY } from '@/graphql/schemas/getTestQuery';

const Home = () => {
  const { data } = useQuery(GET_TEST_QUERY);

  console.log(data);

  return <div>Home</div>;
};

export default Home;
