import { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import InfoTooltip from '../base-tooltip/info-tooltip/InfoTooltip';

type BaseCardProps = {
  title?: string;
  cardClassName?: string;
  cardHeaderClassName?: string;
  cardContentClassName?: string;
  cardTittleClassName?: string;
  cardDescriptionClassName?: string;
  description?: string;
  children?: ReactNode;
  footerContent?: React.JSX.Element | null;
  footerClassName?: string;
  icon?: React.JSX.Element | null;
  infoTooltip?: {
    id: string;
    message: string;
    className?: string;
    iconSize?: string;
    iconClassName?: string;
  };
};

const BaseCard = ({
  title,
  cardClassName,
  description,
  children,
  footerContent,
  footerClassName,
  cardHeaderClassName,
  cardContentClassName,
  cardTittleClassName,
  cardDescriptionClassName,
  icon,
  infoTooltip,
}: BaseCardProps) => {
  return (
    <Card className={cardClassName} data-testid='base-card'>
      <CardHeader
        className={cn(
          icon ? 'w-full flex-row justify-center items-center' : 'flex-col items-start',
          cardHeaderClassName
        )}
      >
        {icon && <div className='flex-0 flex-shrink-0 basis-8'>{icon}</div>}
        <div className='flex items-center gap-2'>
          <CardTitle className={cardTittleClassName}>{title}</CardTitle>
          {infoTooltip ? (
            <InfoTooltip
              className={infoTooltip.className}
              iconClassName={infoTooltip?.iconClassName}
              iconSize={infoTooltip.iconSize}
              id={infoTooltip.id}
              message={infoTooltip.message}
            />
          ) : null}
        </div>
        <CardDescription className={cardDescriptionClassName}>{description}</CardDescription>
      </CardHeader>
      <CardContent className={cardContentClassName}>{children}</CardContent>
      {footerContent ? (
        <CardFooter className={footerClassName} data-testid='base-card-footer'>
          {footerContent}
        </CardFooter>
      ) : null}
    </Card>
  );
};

export default BaseCard;
