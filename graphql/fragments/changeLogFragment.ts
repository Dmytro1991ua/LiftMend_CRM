import gql from 'graphql-tag';

export const CHANGE_LOG_FRAGMENT = gql`
  fragment ChangeLogFields on ChangeLog {
    modifiedBy
    id
    entityType
    entityId
    changeList {
      field
      oldValue
      newValue
      action
    }
    createdAt
  }
`;
