import React from 'react';

import { useQuery } from '@apollo/client';

import { GET_TEST_QUERY } from '@/graphql/schemas/getTestQuery';

const Home = () => {
  const { data } = useQuery(GET_TEST_QUERY);

  console.log(data);

  return <div className='content-wrapper'>Home</div>;
};

export default Home;
