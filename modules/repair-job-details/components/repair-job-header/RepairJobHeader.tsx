import { useCallback } from 'react';

import { useRouter } from 'next/router';
import { AiFillEdit } from 'react-icons/ai';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Audio } from 'react-loader-spinner';

import { Button } from '@/components/ui/button';
import SectionHeader from '@/shared/section-header';

import { ActionButtonConfig, ActionButtonLabel } from '../../types';

type RepairJobHeaderProps = {
  loading: boolean;
  description: string;
  title: string;
  onOpenEditModal: () => void;
};

const RepairJobHeader = ({ loading, description, title, onOpenEditModal }: RepairJobHeaderProps) => {
  const router = useRouter();

  const onHandleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const ACTION_BUTTONS_CONFIG: ActionButtonConfig[] = [
    {
      id: 1,
      variant: 'default',
      label: ActionButtonLabel.EDIT,
      icon: <AiFillEdit />,
      onClick: () => onOpenEditModal(),
    },
    // {
    //   id: 1,
    //   variant: 'destructive',
    //   label: ActionButtonLabel.DELETE,
    //   icon: <MdDelete />,
    //   onClick: () => {
    //     console.log('Delete');
    //   },
    // },
  ];

  const renderGoBackButton = (
    <Button variant='default' onClick={onHandleGoBack}>
      <IoMdArrowRoundBack size={20} />
    </Button>
  );

  const renderActionButtons = (
    <div className='flex gap-2'>
      {ACTION_BUTTONS_CONFIG.map(({ id, label, icon, variant, onClick }) => (
        <Button key={id} variant={variant} onClick={onClick}>
          {icon}
          <span className='ml-2'>{label}</span>
        </Button>
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

export default RepairJobHeader;
