import { useCallback } from 'react';

import { useRouter } from 'next/router';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Audio } from 'react-loader-spinner';

import { Button } from '@/components/ui/button';
import BaseTooltip from '@/shared/base-tooltip/BaseTooltip';
import SectionHeader from '@/shared/section-header';

import { DetailsPageActionButtonConfig } from '../types';

type DetailsPageHeaderProps = {
  loading: boolean;
  description?: string;
  title: string;
  actionButtonsConfig: DetailsPageActionButtonConfig[];
};

const DetailsPageHeader = ({ loading, description, title, actionButtonsConfig }: DetailsPageHeaderProps) => {
  const router = useRouter();

  const onHandleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const renderGoBackButton = (
    <Button variant='default' onClick={onHandleGoBack}>
      <IoMdArrowRoundBack size={20} />
    </Button>
  );

  const renderActionButtons = (
    <div className='flex gap-2'>
      {actionButtonsConfig.map(({ id, label, icon, variant, tooltipData, isDisabled, onClick }) => (
        <BaseTooltip
          key={id}
          className={tooltipData?.className}
          disable={!tooltipData?.disable}
          id={tooltipData?.id ?? ''}
          message={tooltipData?.message ?? ''}
        >
          <Button disabled={isDisabled} variant={variant} onClick={onClick}>
            {icon}
            <span className='ml-2'>{label}</span>
          </Button>
        </BaseTooltip>
      ))}
    </div>
  );

  return (
    <>
      {loading ? (
        <Audio ariaLabel='bars-loading' color='#2563eb' height='40' visible={true} width='40' wrapperClass='mb-8' />
      ) : (
        <SectionHeader
          actionComponent={renderActionButtons}
          goBackButton={renderGoBackButton}
          subtitle={description}
          title={title}
        />
      )}
    </>
  );
};

export default DetailsPageHeader;
