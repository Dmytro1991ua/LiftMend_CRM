export type ScoreThresholdStyleClasses = {
  background: string;
  text: string;
  border: string;
};

export type ScoreThresholdTooltip<TLabel extends string> = {
  id: TLabel;
  getTooltipMessage: (score: number) => string;
};

export type ScoreTooltipMessageParams<TLabel extends string, TDescription extends string> = {
  score: number;
  title: string;
  label: TLabel;
  description: TDescription;
};

export type ScoreThreshold<TLabel extends string> = {
  value: number;
  label: TLabel;
  color: string;
  classes: ScoreThresholdStyleClasses;
  activeDots?: number;
  tooltipProps?: ScoreThresholdTooltip<TLabel>;
};
