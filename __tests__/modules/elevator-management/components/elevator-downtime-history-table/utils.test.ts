import { formatElevatorDowntimeDuration } from '@/modules/elevator-management/components/elevator-downtime-history-table/utils';

describe('formatElevatorDowntimeDuration', () => {
  const mockDate = new Date('2026-02-25T12:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const mockScenarios = [
    {
      name: 'should format ongoing downtime with minutes only',
      input: { startedAt: new Date('2026-02-25T11:45:00Z'), endedAt: null },
      expected: 'Ongoing (15m)',
    },
    {
      name: 'should format ongoing downtime with hours and minutes',
      input: { startedAt: new Date('2026-02-25T09:30:00Z'), endedAt: null },
      expected: 'Ongoing (2h 30m)',
    },
    {
      name: 'should format ongoing downtime with days, hours, and minutes',
      input: { startedAt: new Date('2026-02-23T08:15:00Z'), endedAt: null },
      expected: 'Ongoing (2d 3h 45m)',
    },
    {
      name: 'should format finished downtime with hours and minutes',
      input: { startedAt: new Date('2026-02-25T09:00:00Z'), endedAt: new Date('2026-02-25T11:30:00Z') },
      expected: '2h 30m',
    },
    {
      name: 'should format finished downtime with days and hours',
      input: { startedAt: new Date('2026-02-23T08:00:00Z'), endedAt: new Date('2026-02-25T09:15:00Z') },
      expected: '2d 1h 15m',
    },
    {
      name: 'should handle zero-duration ongoing downtime',
      input: { startedAt: new Date('2026-02-25T12:00:00Z'), endedAt: null },
      expected: 'Ongoing (0m)',
    },
    {
      name: 'should handle zero-duration finished downtime',
      input: { startedAt: new Date('2026-02-25T12:00:00Z'), endedAt: new Date('2026-02-25T12:00:00Z') },
      expected: '0m',
    },
  ];

  mockScenarios.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = formatElevatorDowntimeDuration(input.startedAt, input.endedAt);

      expect(result).toBe(expected);
    });
  });
});
