import { getAccordionHeight, getSelectedFiltersCount } from '@/shared/base-table/table-filters/utils';
import { FilterValues } from '@/shared/base-table/types';

describe('getSelectedFiltersCount', () => {
  const mockScenarios = [
    { description: 'no filters', filterValues: {}, expected: 0 },
    { description: 'all empty arrays', filterValues: { category: [], status: [] }, expected: 0 },
    { description: 'one filter selected', filterValues: { category: ['A'], status: [] }, expected: 1 },
    { description: 'multiple filters selected', filterValues: { category: ['A'], status: ['B', 'C'] }, expected: 2 },
  ];

  mockScenarios.forEach(({ description, filterValues, expected }) => {
    it(`should return ${expected} when ${description}`, () => {
      expect(getSelectedFiltersCount(filterValues as FilterValues)).toBe(expected);
    });
  });
});

describe('getAccordionHeight', () => {
  const mockScenarios = [
    {
      description: 'currentOpenedFilter is true and isAccordionAutoHeight is true',
      currentOpenedFilter: 'test-filter-opened',
      isAccordionAutoHeight: true,
      expected: 'h-auto',
    },
    {
      description: 'currentOpenedFilter is true and isAccordionAutoHeight is false',
      currentOpenedFilter: 'test-filter-opened',
      isAccordionAutoHeight: false,
      expected: 'h-[50rem] overflow-y-auto',
    },
    {
      description: 'currentOpenedFilter is false and isAccordionAutoHeight is true',
      currentOpenedFilter: null,
      isAccordionAutoHeight: true,
      expected: 'h-auto',
    },
    {
      description: 'currentOpenedFilter is false and isAccordionAutoHeight is false',
      currentOpenedFilter: null,
      isAccordionAutoHeight: false,
      expected: 'h-auto',
    },
  ];

  mockScenarios.forEach(({ description, currentOpenedFilter, isAccordionAutoHeight, expected }) => {
    it(`should return "${expected}" when ${description}`, () => {
      expect(getAccordionHeight(currentOpenedFilter, isAccordionAutoHeight)).toBe(expected);
    });
  });
});
