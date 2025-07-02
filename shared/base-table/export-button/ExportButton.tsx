import { Column, RowModel } from '@tanstack/react-table';
import { CSVLink } from 'react-csv';
import { BsDownload } from 'react-icons/bs';

import { cn } from '@/lib/utils';
import { TableNames } from '@/shared/types';

import { convertExportFileNameToCorrectFormat, getDataToExport } from './utils';

export type ExportButtonProps<T> = {
  rowModel?: RowModel<T>;
  columns?: Column<T, unknown>[];
  tableName: TableNames;
  isDisabled?: boolean;
};

const EXPORT_BUTTON_LABEL = 'Export to CSV';

const ExportButton = <T,>({ rowModel, columns, tableName, isDisabled }: ExportButtonProps<T>) => {
  const exportFileName = convertExportFileNameToCorrectFormat(tableName, new Date(Date.now()));
  const dataToExport = getDataToExport(tableName, columns, rowModel);

  const buttonClass = cn(
    'flex items-center justify-center gap-2 w-fit bg-primary text-sm text-white px-3 py-2.5 rounded-sm',
    {
      'bg-gray-300 cursor-not-allowed pointer-events-all': isDisabled,
    }
  );

  const renderButtonContent = <span>{EXPORT_BUTTON_LABEL}</span>;

  return (
    <>
      {isDisabled ? (
        <button disabled className={buttonClass} data-testid='regular-btn' type='button'>
          <BsDownload />
          {renderButtonContent}
        </button>
      ) : (
        <CSVLink
          className={buttonClass}
          data={dataToExport}
          data-testid='csv-link'
          filename={`${exportFileName}.csv`}
          role='link'>
          <BsDownload />
          {renderButtonContent}
        </CSVLink>
      )}
    </>
  );
};

export default ExportButton;
