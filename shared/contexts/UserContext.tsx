import { ReactNode, createContext, useContext, useMemo } from 'react';

import { ApolloQueryResult, useQuery } from '@apollo/client';
import { useSession } from '@supabase/auth-helpers-react';

import { GET_USER } from '@/graphql/schemas/getUser';
import { AppUser, GetUserQuery, GetUserQueryVariables } from '@/graphql/types/client/generated_types';

import { removeTypeNamesFromObject } from '../utils';

interface UserContextType {
  user: AppUser | null;
  loading: boolean;
  error?: string;
  refetch: (variables?: Partial<GetUserQueryVariables>) => Promise<ApolloQueryResult<GetUserQuery>>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: undefined,
  refetch: async () => new Promise(() => {}),
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const session = useSession();

  const { data, loading, error, refetch } = useQuery<GetUserQuery, GetUserQueryVariables>(GET_USER, {
    variables: { id: session?.user.id ?? '' },
    skip: !session?.user.id,
    fetchPolicy: 'cache-first',
  });

  const user: AppUser | null = useMemo(() => {
    if (!data?.getUser) return null;

    return removeTypeNamesFromObject(data.getUser);
  }, [data]);

  return (
    <UserContext.Provider value={{ user, loading, error: error?.message, refetch }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
