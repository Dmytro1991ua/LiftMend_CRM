import { useMemo } from 'react';

import { ApolloQueryResult, useQuery } from '@apollo/client';
import { useSession } from '@supabase/auth-helpers-react';

import { GET_USER } from '@/graphql/schemas/getUser';
import { GetUserQuery, GetUserQueryVariables } from '@/graphql/types/client/generated_types';

type UseGetUser = {
  user: GetUserQuery['getUser'] | null;
  loading: boolean;
  error?: string;
  refetch: (variables?: Partial<GetUserQueryVariables>) => Promise<ApolloQueryResult<GetUserQuery>>;
};

export const useGetUser = (): UseGetUser => {
  const session = useSession();

  const { data, loading, error, refetch } = useQuery<GetUserQuery, GetUserQueryVariables>(GET_USER, {
    variables: { id: session?.user.id ?? '' },
    skip: !session?.user.id,
    fetchPolicy: 'cache-first',
  });

  const user = useMemo(() => data?.getUser || null, [data?.getUser]);

  return {
    user,
    loading,
    error: error?.message,
    refetch,
  };
};
