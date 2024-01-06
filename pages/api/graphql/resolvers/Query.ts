import { QueryResolvers } from '@/graphql/types/server/generated_types';

const Query: QueryResolvers = {
  hello: () => 'world',
};

export default Query;
