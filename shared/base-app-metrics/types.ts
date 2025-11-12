export enum CommonCardStyles {
  CardClassName = 'cardClassName',
  CardHeaderClassName = 'cardHeaderClassName',
  cardTittleClassName = 'cardTittleClassName',
  cardContentClassName = 'cardContentClassName',
}

export type BaseMetricsConfig<T> = {
  id: number;
  icon: React.JSX.Element;
  title: T;
  metric: number | string;
  cardClassName: string;
  cardHeaderClassName: string;
  cardTittleClassName: string;
  cardContentClassName: string;
  infoTooltip?: {
    id: string;
    message: string;
    className?: string;
    iconSize?: string;
    iconClassName?: string;
  };
};
