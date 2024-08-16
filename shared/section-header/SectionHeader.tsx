import { SectionHeaderTitle } from '@/types/enums';

type SectionHeaderProps = {
  title: SectionHeaderTitle | string;
  subtitle?: string;
  actionComponent?: React.JSX.Element;
  goBackButton?: React.JSX.Element;
};

const SectionHeader = ({ title, subtitle, goBackButton, actionComponent }: SectionHeaderProps): React.JSX.Element => {
  const headerActions = <>{actionComponent ? actionComponent : null}</>;
  const headerGoBackButton = <div className='mr-4'>{goBackButton ? goBackButton : null}</div>;

  return (
    <section className='flex items-center mb-5'>
      {headerGoBackButton}
      <div>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <h3 className='text-link mr-2'>{subtitle}</h3>
      </div>
      <div className='ml-auto' data-testid='header-actions'>
        {headerActions}
      </div>
    </section>
  );
};

export default SectionHeader;
