import {
  Period,
  TimePickerType,
  convert12HourTo24Hour,
  display12HourValue,
  getArrowByType,
  getDateByType,
  getValid12Hour,
  getValidArrowNumber,
  getValidHour,
  getValidMinuteOrSecond,
  getValidNumber,
  isValid12Hour,
  isValidHour,
  isValidMinuteOrSecond,
  set12Hours,
  setDateByType,
  setHours,
  setMinutes,
  setSeconds,
} from '@/shared/time-picker/utils';

describe('utils', () => {
  describe('isValidHour', () => {
    it('should correctly validate 00-23 hours', () => {
      expect(isValidHour('00')).toBe(true);
      expect(isValidHour('09')).toBe(true);
      expect(isValidHour('23')).toBe(true);
      expect(isValidHour('24')).toBe(false);
      expect(isValidHour('3')).toBe(false);
    });
  });

  describe('isValid12Hour', () => {
    it('should correctly validate 01-12 hours', () => {
      expect(isValid12Hour('01')).toBe(true);
      expect(isValid12Hour('12')).toBe(true);
      expect(isValid12Hour('00')).toBe(false);
      expect(isValid12Hour('13')).toBe(false);
    });
  });

  describe('isValidMinuteOrSecond', () => {
    it('should correctly validate 00-59 minutes or seconds', () => {
      expect(isValidMinuteOrSecond('00')).toBe(true);
      expect(isValidMinuteOrSecond('30')).toBe(true);
      expect(isValidMinuteOrSecond('59')).toBe(true);
      expect(isValidMinuteOrSecond('60')).toBe(false);
      expect(isValidMinuteOrSecond('5')).toBe(false);
    });
  });

  describe('getValidNumber', () => {
    it('should return padded value within min-max when loop false', () => {
      expect(getValidNumber('5', { max: 10, min: 0, loop: false })).toBe('05');
      expect(getValidNumber('15', { max: 10, min: 0, loop: false })).toBe('10');
      expect(getValidNumber('-5', { max: 10, min: 0, loop: false })).toBe('00');
      expect(getValidNumber('abc', { max: 10 })).toBe('00');
    });

    it('should loop around when loop prop is true', () => {
      expect(getValidNumber('15', { max: 10, min: 0, loop: true })).toBe('00');
      expect(getValidNumber('-1', { max: 10, min: 0, loop: true })).toBe('10');
    });

    it('should loop correctly when numericValue > max', () => {
      expect(getValidNumber('25', { max: 23, min: 0, loop: true })).toBe('00'); // 25 > 23 → 0 (min)
    });

    it('should loop correctly when numericValue < min', () => {
      expect(getValidNumber('-1', { max: 23, min: 0, loop: true })).toBe('23'); // -1 < 0 → 23 (max)
    });

    it('should return "00" on invalid input', () => {
      expect(getValidNumber('invalid', { max: 23 })).toBe('00');
    });
  });

  describe('getValidHour', () => {
    it('should returns valid hour or clamps via getValidNumber', () => {
      expect(getValidHour('23')).toBe('23');
      expect(getValidHour('24')).toBe('23');
      expect(getValidHour('abc')).toBe('00');
    });
  });

  describe('getValid12Hour', () => {
    it('should return valid 12-hour or clamps via getValidNumber', () => {
      expect(getValid12Hour('01')).toBe('01');
      expect(getValid12Hour('13')).toBe('12');
      expect(getValid12Hour('0')).toBe('01');
    });
  });

  describe('getValidMinuteOrSecond', () => {
    it('should return valid minute/second or clamps via getValidNumber', () => {
      expect(getValidMinuteOrSecond('59')).toBe('59');
      expect(getValidMinuteOrSecond('60')).toBe('59');
      expect(getValidMinuteOrSecond('abc')).toBe('00');
    });
  });

  describe('getValidArrowNumber', () => {
    it('should increment and loops properly', () => {
      expect(getValidArrowNumber('23', { min: 0, max: 23, step: 1 })).toBe('00'); // loops from 23+1=24 -> 0
      expect(getValidArrowNumber('0', { min: 0, max: 23, step: -1 })).toBe('23'); // loops from 0-1=-1 -> 23
      expect(getValidArrowNumber('10', { min: 0, max: 23, step: 5 })).toBe('15');
      expect(getValidArrowNumber('abc', { min: 0, max: 23, step: 1 })).toBe('00');
    });
  });

  describe('setMinutes', () => {
    it('should set minutes correctly', () => {
      const date = new Date(2023, 0, 1, 10, 0);

      const updatedDate = setMinutes(date, '30');

      expect(updatedDate.getMinutes()).toBe(30);
    });
  });

  describe('setSeconds', () => {
    it('should set seconds correctly', () => {
      const date = new Date(2023, 0, 1, 10, 0, 0);

      const updatedDate = setSeconds(date, '45');

      expect(updatedDate.getSeconds()).toBe(45);
    });
  });

  describe('setHours', () => {
    it('should set hours correctly', () => {
      const date = new Date(2023, 0, 1, 0);

      const updatedDate = setHours(date, '23');

      expect(updatedDate.getHours()).toBe(23);
    });
  });

  describe('set12Hours', () => {
    it('should correctly set 12-hour for AM', () => {
      const date = new Date(2023, 0, 1, 0);

      const updated = set12Hours(date, '12', 'AM');

      expect(updated.getHours()).toBe(0);
    });

    it('should set correctly 12-hour for PM', () => {
      const date = new Date(2023, 0, 1, 0);

      const updated = set12Hours(date, '1', 'PM');

      expect(updated.getHours()).toBe(13);
    });
  });

  describe('setDateByType', () => {
    it('should call appropriate set function based on type', () => {
      const date = new Date(2023, 0, 1, 0, 0, 0);

      expect(setDateByType(new Date(date), '15', 'minutes')?.getMinutes()).toBe(15);
      expect(setDateByType(new Date(date), '30', 'seconds')?.getSeconds()).toBe(30);
      expect(setDateByType(new Date(date), '12', 'hours')?.getHours()).toBe(12);
      expect(setDateByType(new Date(date), '12', '12hours', 'AM')?.getHours()).toBe(0);
      expect(setDateByType(new Date(date), '12', '12hours')).toEqual(date); // no period given returns unchanged
      expect(setDateByType(new Date(date), '10', 'unknown' as TimePickerType)).toEqual(date);
    });
  });

  describe('getDateByType', () => {
    const date = new Date(2023, 0, 1, 13, 5, 9);

    it('should return minutes padded', () => {
      expect(getDateByType(date, 'minutes')).toBe('05');
    });

    it('should return seconds padded', () => {
      expect(getDateByType(date, 'seconds')).toBe('09');
    });

    it('should return hours padded', () => {
      expect(getDateByType(date, 'hours')).toBe('13');
    });

    it('should return 12-hour formatted', () => {
      expect(getDateByType(date, '12hours')).toBe('01');
    });

    it('should handle string date input', () => {
      expect(getDateByType(date.toISOString(), 'minutes')).toBe('05');
    });

    it('should return "00" for unknown type', () => {
      expect(getDateByType(date, 'unknown' as TimePickerType)).toBe('00');
    });
  });

  describe('getArrowByType', () => {
    it('should call appropriate arrow increment function', () => {
      expect(getArrowByType('10', 1, 'minutes')).toBe('11');
      expect(getArrowByType('10', 1, 'seconds')).toBe('11');
      expect(getArrowByType('10', 1, 'hours')).toBe('11');
      expect(getArrowByType('10', 1, '12hours')).toBe('11');
      expect(getArrowByType('10', 1, 'unknown' as TimePickerType)).toBe('00');
    });
  });

  describe('convert12HourTo24Hour', () => {
    it('should correctly convert PM hours', () => {
      expect(convert12HourTo24Hour(1, 'PM')).toBe(13);
      expect(convert12HourTo24Hour(12, 'PM')).toBe(12);
      expect(convert12HourTo24Hour(11, 'PM')).toBe(23);
    });

    it('should correctly converts AM hours', () => {
      expect(convert12HourTo24Hour(12, 'AM')).toBe(0);
      expect(convert12HourTo24Hour(1, 'AM')).toBe(1);
      expect(convert12HourTo24Hour(11, 'AM')).toBe(11);
    });

    it('should return hour unchanged for invalid period', () => {
      expect(convert12HourTo24Hour(10, 'XX' as Period)).toBe(10);
    });
  });

  describe('display12HourValue', () => {
    it('should return "12" for 0 or 12', () => {
      expect(display12HourValue(0)).toBe('12');
      expect(display12HourValue(12)).toBe('12');
    });

    it('should return hours - 12 for hours >= 22', () => {
      expect(display12HourValue(22)).toBe('10');
      expect(display12HourValue(23)).toBe('11');
    });

    it('should pad single digit hours correctly', () => {
      expect(display12HourValue(13)).toBe('01');
      expect(display12HourValue(14)).toBe('02');
    });

    it('should return hour as string if > 9 mod 12', () => {
      expect(display12HourValue(21)).toBe('09');
    });
  });
});
