import gql from 'graphql-tag';

export const INVENTORY_PART_FRAGMENT = gql`
  fragment InventoryPartFields on InventoryPart {
    id
    name
    stock
    minStock
    unitPrice
    createdAt
    status
  }
`;
