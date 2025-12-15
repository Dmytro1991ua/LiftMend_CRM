import { useCallback } from 'react';

import { useRouter } from 'next/router';
import { IoMdArrowRoundBack } from 'react-icons/io';

import { Button } from '@/components/ui/button';

type GoBackButtonProps = {
  iconSize?: number;
  className?: string;
};

const DEFAULT_ICON_SIZE = 20;

const GoBackButton = ({ iconSize = DEFAULT_ICON_SIZE, className }: GoBackButtonProps) => {
  const router = useRouter();

  const onHandleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Button className={className} data-testid='go-back-button' variant='default' onClick={onHandleGoBack}>
      <IoMdArrowRoundBack size={iconSize} />
    </Button>
  );
};

export default GoBackButton;
