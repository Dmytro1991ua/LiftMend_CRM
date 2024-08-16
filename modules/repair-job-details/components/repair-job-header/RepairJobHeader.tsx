import { useCallback } from 'react';

import { useRouter } from 'next/router';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Audio } from 'react-loader-spinner';

import { Button } from '@/components/ui/button';
import SectionHeader from '@/shared/section-header';

type RepairJobHeaderProps = {
  loading: boolean;
  description: string;
  title: string;
};

const RepairJobHeader = ({ loading, description, title }: RepairJobHeaderProps) => {
  const router = useRouter();

  const onHandleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const renderGoBackButton = (
    <Button variant='default' onClick={onHandleGoBack}>
      <IoMdArrowRoundBack size={20} />
    </Button>
  );

  return (
    <>
      {loading ? (
        <Audio ariaLabel='bars-loading' color='#2563eb' height='40' visible={true} width='40' wrapperClass='mb-8' />
      ) : (
        <SectionHeader goBackButton={renderGoBackButton} subtitle={description} title={title} />
      )}
    </>
  );
};

export default RepairJobHeader;
