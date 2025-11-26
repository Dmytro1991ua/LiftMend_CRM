import { ElevatorRecord } from '@/graphql/types/client/generated_types';
import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { HealthScoreLabel, HealthScoreTooltipDescription } from '@/modules/elevator-management/types';
import {
  convertElevatorRecordToFormValues,
  convertFormFieldsToElevatorRecord,
  getElevatorHealthScoreColor,
  getElevatorHealthTooltipMessage,
} from '@/modules/elevator-management/utils';

describe('convertElevatorRecordToFormValues', () => {
  it('should convert a elevator record to form values', () => {
    const mockExpectedOutput = {
      buildingName: 'Skyline Plaza',
      capacity: 5000,
      elevatorLocation: 'Observation Deck',
      elevatorType: 'Scenic Elevator',
      id: 'test_id',
      lastMaintenanceDate: new Date('2024-05-20T10:00:00.000Z'),
      nextMaintenanceDate: new Date('2024-08-30T16:00:00.000Z'),
      status: 'Operational',
    };

    expect(convertElevatorRecordToFormValues(mockElevatorRecord)).toEqual(mockExpectedOutput);
  });

  it('should handle null input gracefully', () => {
    const result = convertElevatorRecordToFormValues(null as unknown as ElevatorRecord);

    const mockExpectedOutput = {
      elevatorType: null,
      capacity: null,
      buildingName: null,
      elevatorLocation: null,
      id: '',
      status: null,
      lastMaintenanceDate: undefined,
      nextMaintenanceDate: undefined,
    };

    expect(result).toEqual(mockExpectedOutput);
  });
});

describe('convertFormFieldsToElevatorRecord', () => {
  const mockLastMaintenanceDate = new Date('2024-05-20T10:00:00.000Z');
  const mockNextMaintenanceDate = new Date('2024-08-30T16:00:00.000Z');

  it('should convert form fields to a complete elevator record', () => {
    const mockInput = {
      buildingName: 'Skyline Plaza',
      capacity: 5000,
      elevatorLocation: 'Observation Deck',
      elevatorType: 'Scenic Elevator',
      id: 'test_id',
      lastMaintenanceDate: mockLastMaintenanceDate,
      nextMaintenanceDate: mockNextMaintenanceDate,
      status: 'Operational',
    };

    expect(convertFormFieldsToElevatorRecord(mockInput)).toEqual(mockInput);
  });

  it('should apply default values when fields are undefined', () => {
    const result = convertFormFieldsToElevatorRecord({
      elevatorType: null,
      capacity: null,
      buildingName: null,
      elevatorLocation: null,
      id: '',
      status: null,
      lastMaintenanceDate: undefined,
      nextMaintenanceDate: undefined,
    });

    expect(result.elevatorType).toBe('');
    expect(result.capacity).toBeNull();
    expect(result.buildingName).toBe('');
    expect(result.elevatorLocation).toBe('');
    expect(result.id).toBe('');
    expect(result.status).toBe('');
    expect(result.lastMaintenanceDate).toBeInstanceOf(Date);
    expect(result.nextMaintenanceDate).toBeInstanceOf(Date);
  });
});

describe('getElevatorHealthScoreColor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testScenarios = [
    { name: 'undefined score', score: undefined, expectedLabel: null, expectedTooltip: null },
    { name: 'null score', score: null, expectedLabel: null, expectedTooltip: null },

    // Poor range (0–49)
    {
      name: 'score at 0',
      score: 0,
      expectedLabel: HealthScoreLabel.Poor,
      expectedTooltip: getElevatorHealthTooltipMessage({
        score: 0,
        label: HealthScoreLabel.Poor,
        description: HealthScoreTooltipDescription.Poor,
      }),
    },
    {
      name: 'score in Poor range',
      score: 25,
      expectedLabel: HealthScoreLabel.Poor,
      expectedTooltip: getElevatorHealthTooltipMessage({
        score: 25,
        label: HealthScoreLabel.Poor,
        description: HealthScoreTooltipDescription.Poor,
      }),
    },

    // Fair range (50–69)
    {
      name: 'score at 50',
      score: 50,
      expectedLabel: HealthScoreLabel.Fair,
      expectedTooltip: getElevatorHealthTooltipMessage({
        score: 50,
        label: HealthScoreLabel.Fair,
        description: HealthScoreTooltipDescription.Fair,
      }),
    },
    {
      name: 'score at 60',
      score: 60,
      expectedLabel: HealthScoreLabel.Fair,
      expectedTooltip: getElevatorHealthTooltipMessage({
        score: 60,
        label: HealthScoreLabel.Fair,
        description: HealthScoreTooltipDescription.Fair,
      }),
    },

    // Good range (70–89)
    {
      name: 'score at 75',
      score: 75,
      expectedLabel: HealthScoreLabel.Good,
      expectedTooltip: getElevatorHealthTooltipMessage({
        score: 75,
        label: HealthScoreLabel.Good,
        description: HealthScoreTooltipDescription.Good,
      }),
    },

    // Excellent range (90–100+)
    {
      name: 'score at 95',
      score: 95,
      expectedLabel: HealthScoreLabel.Excellent,
      expectedTooltip: getElevatorHealthTooltipMessage({
        score: 95,
        label: HealthScoreLabel.Excellent,
        description: HealthScoreTooltipDescription.Excellent,
      }),
    },
    {
      name: 'score at 100',
      score: 100,
      expectedLabel: HealthScoreLabel.Excellent,
      expectedTooltip: getElevatorHealthTooltipMessage({
        score: 100,
        label: HealthScoreLabel.Excellent,
        description: HealthScoreTooltipDescription.Excellent,
      }),
    },
  ];

  testScenarios.forEach(({ name, score, expectedLabel, expectedTooltip }) => {
    it(`should return ${expectedLabel ?? 'null'} label for ${name}`, () => {
      const result = getElevatorHealthScoreColor(score);

      if (!result) return expect(result).toBeNull();

      expect(result.label).toBe(expectedLabel);
      expect(result.value).toBe(score);
      expect(result.tooltipProps.getTooltipMessage(score!)).toBe(expectedTooltip);
    });
  });
});

describe('getElevatorHealthTooltipMessage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testScenarios = [
    {
      name: 'Poor score',
      input: { score: 25, label: HealthScoreLabel.Poor, description: HealthScoreTooltipDescription.Poor },
      expected: `Elevator Health Score: 25 – ${HealthScoreLabel.Poor}. ${HealthScoreTooltipDescription.Poor}`,
    },
    {
      name: 'Fair score',
      input: { score: 55, label: HealthScoreLabel.Fair, description: HealthScoreTooltipDescription.Fair },
      expected: `Elevator Health Score: 55 – ${HealthScoreLabel.Fair}. ${HealthScoreTooltipDescription.Fair}`,
    },
    {
      name: 'Good score',
      input: { score: 75, label: HealthScoreLabel.Good, description: HealthScoreTooltipDescription.Good },
      expected: `Elevator Health Score: 75 – ${HealthScoreLabel.Good}. ${HealthScoreTooltipDescription.Good}`,
    },
    {
      name: 'Excellent score',
      input: { score: 95, label: HealthScoreLabel.Excellent, description: HealthScoreTooltipDescription.Excellent },
      expected: `Elevator Health Score: 95 – ${HealthScoreLabel.Excellent}. ${HealthScoreTooltipDescription.Excellent}`,
    },
  ];

  testScenarios.forEach(({ name, input, expected }) => {
    it(`should return correct message for ${name} health score`, () => {
      expect(getElevatorHealthTooltipMessage(input)).toBe(expected);
    });
  });
});
