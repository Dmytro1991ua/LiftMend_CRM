import { mockBenjaminHallRecord } from '@/mocks/technicianManagementMocks';
import {
  DEFAULT_DISABLED_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE,
  DEFAULT_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE,
} from '@/modules/technician-management/components/technician-management-table/constants';
import { getRowTooltipMessage } from '@/modules/technician-management/components/technician-management-table/utils';

describe('getRowTooltipMessage', () => {
  it('should return default technician record tooltip', () => {
    expect(getRowTooltipMessage(mockBenjaminHallRecord)).toEqual(DEFAULT_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE);
  });

  it('should return specific tooltip for disabled table row', () => {
    expect(getRowTooltipMessage({ ...mockBenjaminHallRecord, employmentStatus: 'Inactive' })).toEqual(
      DEFAULT_DISABLED_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE
    );
  });
});
