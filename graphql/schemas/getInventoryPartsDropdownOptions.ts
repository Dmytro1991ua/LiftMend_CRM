import gql from 'graphql-tag';

export const GET_INVENTORY_PARTS_DROPDOWN_OPTIONS = gql`
  query GetInventoryPartsDropdownOptions {
    getInventoryPartsDropdownOptions {
      value
      label
      isDisabled
      disabledReason
    }
  }
`;
