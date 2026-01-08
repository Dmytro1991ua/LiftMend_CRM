import gql from 'graphql-tag';

export const GET_CHANGE_LOG_FILTER_DATA = gql`
  query GetChangeLogFilterData {
    getChangeLogFilterData {
      actions
      entityTypes
      users {
        label
        value
      }
    }
  }
`;
