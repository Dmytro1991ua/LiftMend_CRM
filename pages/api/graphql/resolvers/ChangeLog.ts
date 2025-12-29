import { ChangeLogResolvers } from '@/graphql/types/server/generated_types';

import { parseChangeLogValue } from './utils';

const ChangeLog: ChangeLogResolvers = {
  oldValue: ({ oldValue }) => parseChangeLogValue(oldValue),
  newValue: ({ newValue }) => parseChangeLogValue(newValue),
};

export default ChangeLog;
