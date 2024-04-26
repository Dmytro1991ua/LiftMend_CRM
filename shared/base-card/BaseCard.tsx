import { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type BaseCardProps = {
  title: string;
  cardClassName?: string;
  description?: string;
  children?: ReactNode;
  footerContent?: React.JSX.Element | null;
  footerClassName?: string;
};

const BaseCard = ({ title, cardClassName, description, children, footerContent, footerClassName }: BaseCardProps) => {
  return (
    <Card className={cardClassName} data-testid='base-card'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footerContent ? (
        <CardFooter className={footerClassName} data-testid='base-card-footer'>
          {footerContent}
        </CardFooter>
      ) : null}
    </Card>
  );
};

export default BaseCard;
