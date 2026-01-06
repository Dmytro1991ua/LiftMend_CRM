import { EMPTY_CHANGE_LOG_VALUE } from '@/modules/change-log/constants';
import { formatChangeLogObjectValue, formatChangeLogValue, formattedChangeLogDate } from '@/modules/change-log/utils';

describe('formatChangeLogObjectValue', () => {
  const mockScenarios = [
    {
      name: 'should convert a normal object to comma-separated string',
      input: { status: 'Read', count: 5 },
      expected: 'status: Read, count: 5',
    },
    {
      name: 'should handle empty object',
      input: {},
      expected: '',
    },
    {
      name: 'should convert booleans and numbers to string',
      input: { active: true, retries: 3 },
      expected: 'active: true, retries: 3',
    },
  ];

  mockScenarios.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(formatChangeLogObjectValue(input)).toBe(expected);
    });
  });
});

describe('formattedChangeLogDate', () => {
  const mockScenarios = [
    {
      name: 'should return placeholder for null',
      input: null,
      expected: EMPTY_CHANGE_LOG_VALUE,
    },
    {
      name: 'should format valid ISO string to readable string',
      input: '2026-01-05T08:15:52.762Z',
      expectedCheck: (result: string) => {
        expect(typeof result).toBe('string');
        expect(result).not.toBe('2026-01-05T08:15:52.762Z');
      },
    },
    {
      name: 'should return original string if invalid date',
      input: 'not-a-date',
      expected: 'not-a-date',
    },
  ];

  mockScenarios.forEach(({ name, input, expected, expectedCheck }) => {
    it(name, () => {
      const result = formattedChangeLogDate(input);

      if (expectedCheck) {
        expectedCheck(result);
      } else {
        expect(result).toBe(expected);
      }
    });
  });
});

describe('formatChangeLogValue', () => {
  // Object that throws on access to trigger catch branch
  const mockNonSerializableObject = Object.defineProperty({}, 'a', {
    enumerable: true,
    get() {
      throw new Error('cannot access');
    },
  });

  const mockScenarios = [
    {
      name: 'should return placeholder for null',
      input: null,
      expected: EMPTY_CHANGE_LOG_VALUE,
    },
    {
      name: 'should return placeholder for undefined',
      input: undefined,
      expected: EMPTY_CHANGE_LOG_VALUE,
    },
    {
      name: 'should convert booleans to string',
      input: true,
      expected: 'true',
    },
    {
      name: 'should convert numbers to string',
      input: 42,
      expected: '42',
    },
    {
      name: 'should format valid ISO date string',
      input: '2026-01-05T08:15:52.762Z',
      expectedCheck: (result: string) => {
        expect(typeof result).toBe('string');
        expect(result).not.toBe('2026-01-05T08:15:52.762Z');
      },
    },
    {
      name: 'should return string as-is if not a date',
      input: 'Hello World',
      expected: 'Hello World',
    },
    {
      name: 'should convert array to comma-separated string',
      input: ['one', 2, true],
      expected: 'one, 2, true',
    },
    {
      name: 'should convert object using comma-separated string',
      input: { a: 1, b: 'x' },
      expected: 'a: 1, b: x',
    },
    {
      name: 'should return placeholder for non-serializable object',
      input: mockNonSerializableObject,
      expected: EMPTY_CHANGE_LOG_VALUE,
    },
    {
      name: 'should convert unknown type to string',
      input: Symbol('test'),
      expected: 'Symbol(test)',
    },
  ];

  mockScenarios.forEach(({ name, input, expected, expectedCheck }) => {
    it(name, () => {
      const result = formatChangeLogValue(input);

      if (expectedCheck) {
        expectedCheck(result);
      } else {
        expect(result).toBe(expected);
      }
    });
  });
});
