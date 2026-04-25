import gql from 'graphql-tag';

import { INVENTORY_PART_FRAGMENT } from '../fragments';

export const GET_INVENTORY_PARTS = gql`
  query GetInventoryParts(
    $paginationOptions: PaginationOptions
    $filterOptions: InventoryPartFilterOptions
    $sortOptions: InventoryPartSortInput
  ) {
    getInventoryParts(paginationOptions: $paginationOptions, filterOptions: $filterOptions, sortOptions: $sortOptions) {
      edges {
        cursor
        node {
          ...InventoryPartFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      total
    }
  }

  ${INVENTORY_PART_FRAGMENT}
`;
