import { StylesConfig } from 'react-select';

import { DropdownOption, DropdownOptionGroup } from './types';

export const getBaseSelectStylesConfig = <T extends string, IsMulti extends boolean>(
  hasError?: boolean
): StylesConfig<DropdownOption<T>, IsMulti, DropdownOptionGroup<T>> => ({
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 999,
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: '0.2rem',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    zIndex: 999,
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    maxHeight: 'max-content',
    overflowY: 'hidden',
  }),
  option: (provided, state) => ({
    ...provided,
    color: '#1f2937',
    padding: '1.2rem',
    backgroundColor: state.isSelected ? '#DEEBFF' : state.isFocused ? '#f3f4f6' : 'transparent',
    borderBottom: '1px solid #e5e7eb',
  }),
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    boxShadow: 'none',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer-events',
    pointerEvents: state.isDisabled ? 'all' : 'visible',
    padding: state.isMulti ? '0.5rem' : '0.2rem',
    backgroundColor: state.isDisabled ? '#e5e7eb' : hasError ? '#fee2e2' : '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    opacity: state.isDisabled ? '0.6' : '1',

    '&:hover': {
      borderColor: state.isDisabled ? 'transparent' : hasError ? '#f87171' : '#3b82f6',
    },

    ...(state.isFocused && {
      borderColor: hasError ? '#f87171' : '#3b82f6',
      boxShadow: `0 0 0 2px ${hasError ? 'rgba(248, 113, 113, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
    }),
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#374151',
    fontSize: '1.4rem',
    fontWeight: '600',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: hasError ? '#fca5a1' : '#9ca3af',
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: '#9ca3af',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#4b5563',
  }),
  loadingIndicator: (provided) => ({
    ...provided,
    color: '#9ca3af',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.8rem',
    padding: '0.25rem 0.5rem',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#2563eb',
      color: 'white',
    },
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: '#9ca3af',
  }),
  groupHeading: (provided) => ({
    ...provided,
    fontWeight: 600,
    color: '#1f2937',
  }),
  group: (provided) => ({
    ...provided,
    borderTop: '1px solid #d1d5db',
  }),
});
