import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';

import { getSelectedFilterCountLabel } from '../utils';

type FilterHeaderProps = {
  label: string;
  selectedFiltersCount: number;
  onClear: () => void;
};

const FilterHeader = ({ label, selectedFiltersCount, onClear }: FilterHeaderProps) => {
  const isButtonDisabled = selectedFiltersCount === 0;

  const selectedFilterOptionsCountLabel = useMemo(
    () => getSelectedFilterCountLabel(label, selectedFiltersCount),
    [label, selectedFiltersCount]
  );

  const onClearFilter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();

      onClear();
    },
    [onClear]
  );

  return (
    <>
      <h3 className='text-sm'>{selectedFilterOptionsCountLabel}</h3>
      <Button
        className='ml-auto hover:bg-transparent'
        disabled={isButtonDisabled}
        variant='ghost'
        onClick={onClearFilter}
      >
        <span className='text-xs text-primary uppercase font-bold'>Clear</span>
      </Button>
    </>
  );
};

export default FilterHeader;
