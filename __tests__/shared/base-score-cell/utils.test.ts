import { ScoreThreshold } from '@/shared/base-score-cell/types';
import {
  getScoreGaugeChartConfig,
  getScoreGaugeChartData,
  getScoreThresholdLevel,
  getScoreTooltipMessage,
} from '@/shared/base-score-cell/utils';

const TEST_THRESHOLDS: ScoreThreshold<string>[] = [
  {
    value: 90,
    label: 'Excellent',
    color: 'green',
    activeDots: 3,
    classes: { background: 'bg-green-500', text: 'bg-green-500', border: 'bg-green-500' },
    tooltipProps: { id: 'Excellent', getTooltipMessage: (score) => `Score is ${score}` },
  },
  {
    value: 70,
    label: 'Good',
    color: 'yellow',
    activeDots: 2,
    classes: { background: 'bg-yellow-500', text: 'bg-yellow-500', border: 'bg-yellow-500' },
    tooltipProps: { id: 'Good', getTooltipMessage: (score) => `Score is ${score}` },
  },
  {
    value: 50,
    label: 'Fair',
    color: 'orange',
    activeDots: 1,
    classes: { background: 'bg-orange-500', text: 'bg-orange-500', border: 'bg-orange-500' },
    tooltipProps: { id: 'Fair', getTooltipMessage: (score) => `Score is ${score}` },
  },
  {
    value: 0,
    label: 'Poor',
    color: 'red',
    activeDots: 1,
    classes: { background: 'bg-red-500', text: 'bg-red-500', border: 'bg-red-500' },
    tooltipProps: { id: 'Poor', getTooltipMessage: (score) => `Score is ${score}` },
  },
];

describe('getScoreThresholdLevel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const scenarios = [
    { name: 'undefined score', score: undefined, expectedLabel: null },
    { name: 'null score', score: null, expectedLabel: null },
    { name: 'Poor range', score: 25, expectedLabel: 'Poor' },
    { name: 'Fair range', score: 60, expectedLabel: 'Fair' },
    { name: 'Good range', score: 75, expectedLabel: 'Good' },
    { name: 'Excellent range', score: 95, expectedLabel: 'Excellent' },
  ];

  scenarios.forEach(({ name, score, expectedLabel }) => {
    it(`should return correct level for ${name}`, () => {
      const result = getScoreThresholdLevel(score, TEST_THRESHOLDS);

      if (!result) return expect(result).toBeNull();

      expect(result.label).toBe(expectedLabel);
      expect(result.value).toBe(score);
      expect(result?.tooltipProps?.getTooltipMessage(score!)).toBe(`Score is ${score}`);
    });
  });
});

describe('getScoreTooltipMessage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const scenarios = [
    {
      score: 25,
      title: 'Test Score',
      label: 'Poor',
      description: 'Needs improvement',
      expected: 'Test Score: 25 – Poor. Needs improvement',
    },
    {
      score: 55,
      title: 'Test Score',
      label: 'Fair',
      description: 'Some delays',
      expected: 'Test Score: 55 – Fair. Some delays',
    },
    {
      score: 75,
      title: 'Test Score',
      label: 'Good',
      description: 'Minor issues',
      expected: 'Test Score: 75 – Good. Minor issues',
    },
    {
      score: 95,
      title: 'Test Score',
      label: 'Excellent',
      description: 'Outstanding',
      expected: 'Test Score: 95 – Excellent. Outstanding',
    },
  ];

  scenarios.forEach(({ score, title, label, description, expected }) => {
    it(`should return correct tooltip message for score ${score}`, () => {
      const result = getScoreTooltipMessage({ score, title, label, description });

      expect(result).toBe(expected);
    });
  });
});

describe('getScoreGaugeChartData', () => {
  it('should return empty array for null or undefined score', () => {
    expect(getScoreGaugeChartData(undefined)).toEqual([]);
    expect(getScoreGaugeChartData(null)).toEqual([]);
  });

  it('should return correct chart data for a valid score', () => {
    const score = 75;
    expect(getScoreGaugeChartData(score)).toEqual([{ name: 'Score', value: score }]);
  });
});

describe('getScoreGaugeChartConfig', () => {
  it('should return config with correct number of levels and colors reversed', () => {
    const needleColor = 'red';
    const result = getScoreGaugeChartConfig(TEST_THRESHOLDS, needleColor);

    expect(result.nrOfLevels).toBe(TEST_THRESHOLDS.length);
    expect(result.colors).toEqual(TEST_THRESHOLDS.map(({ color }) => color).reverse());
    expect(result.needleColor).toBe(needleColor);
    expect(result.needleBaseColor).toBe(needleColor);
    expect(result.style).toEqual({ width: 500, height: 200 });
    expect(result.hideText).toBe(true);
  });

  it('should handle undefined needle color', () => {
    const result = getScoreGaugeChartConfig(TEST_THRESHOLDS);

    expect(result.needleColor).toBeUndefined();
    expect(result.needleBaseColor).toBeUndefined();
  });

  it('should work with empty thresholds array', () => {
    const result = getScoreGaugeChartConfig([], 'blue');

    expect(result.nrOfLevels).toBe(0);
    expect(result.colors).toEqual([]);
    expect(result.needleColor).toBe('blue');
    expect(result.needleBaseColor).toBe('blue');
  });
});
