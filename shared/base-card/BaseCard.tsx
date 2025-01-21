import { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
}: BaseCardProps) => {
  return (
    <Card className={cardClassName} data-testid='base-card'>
      <CardHeader
        className={cn(
          icon ? 'w-full flex-row justify-center items-center' : 'flex-col items-start',
          cardHeaderClassName
        )}>
        {icon && <div className='flex-0 flex-shrink-0 basis-8'>{icon}</div>}
        <CardTitle className={cardTittleClassName}>{title}</CardTitle>
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
