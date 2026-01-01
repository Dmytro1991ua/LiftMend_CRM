import { ChangeLogResolvers } from '@/graphql/types/server/generated_types';

import { computeChangeLogFieldChanges } from './utils';

const ChangeLog: ChangeLogResolvers = {
  modifiedBy: async ({ userId }, _, { dataSources }) => {
    if (!userId) return 'System';

    const user = await dataSources.user.user(userId);

    const { firstName, lastName, email } = user;

    return firstName && lastName ? `${firstName} ${lastName}` : email.toString();
  },
  changeList: ({ oldValue, newValue, action }) => computeChangeLogFieldChanges({ oldValue, newValue, action }),
};

export default ChangeLog;
