import { CommonCardStyles } from './types';

export const DEFAULT_CARD_METRIC_TEXT = 'N/A';
export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch key app metrics';
export const COMMON_METRIC_CARD_STYLES: Record<CommonCardStyles, string> = {
  cardClassName: 'flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 min-w-[350px]',
  cardHeaderClassName: 'bg-primary text-white text-lg',
  cardTittleClassName: 'text-lg !mt-0',
  cardContentClassName: 'bg-blue-100',
};
export const COMMON_METRIC_CARD_ICON_STYLES = 'w-4 h-4';
