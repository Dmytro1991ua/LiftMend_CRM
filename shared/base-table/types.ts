import { ChangeEvent } from 'react';

import { ColumnSizingState, OnChangeFn, SortingState, VisibilityState } from '@tanstack/react-table';

import { DropdownOption } from '../base-select/types';

export enum TableStatus {
  Loading = 'loading',
  Error = 'error',
  Empty = 'empty',
}

export enum FilterLabel {
  JobType = 'Job Type',
  JobPriority = 'Job Priority',
  Status = 'Status',
  ElevatorType = 'Elevator Type',
  BuildingName = 'Building Name',
  ElevatorLocation = 'Elevator Location',
  TechnicianName = 'Technician Name',
  AvailableStatus = 'Available Status',
  EmploymentStatus = 'Employment Status',
  TechnicianSkills = 'Technician skills',
  Certifications = 'Certifications',
  IsOverdue = 'Is Overdue?',
}

export enum FilterKey {
  RepairJobTypes = 'repairJobTypes',
  ElevatorTypes = 'elevatorTypes',
  BuildingNames = 'buildingNames',
  ElevatorLocations = 'elevatorLocations',
  TechnicianNames = 'technicianNames',
  Priorities = 'priorities',
  Statuses = 'statuses',
  AvailableStatuses = 'availabilityStatuses',
  EmploymentStatuses = 'employmentStatuses',
  TechnicianSkills = 'skills',
  Certifications = 'certifications',
  IsOverdue = 'isOverdue',
}

export type FilterType = 'checkbox' | 'radio';

export type Nullable<T> = T | null;

export type TableState = 'empty' | 'error' | 'loading' | null;

export type RowSelectionState = Record<number, boolean>;

export type FilterValues = {
  [key in FilterKey]?: DropdownOption[];
};

export type TableFilters<T> = {
  searchTerm?: string;
  selectedRows?: T[];
  rowSelectionState?: RowSelectionState;
  columnVisibility?: VisibilityState;
  columnResizingState?: ColumnSizingState;
  filterValues?: FilterValues;
};

export type TableActions = {
  columnVisibility: VisibilityState;
  columnResizing: ColumnSizingState;
  sorting: SortingState;
  rowSelection: RowSelectionState;
  searchTerm: string;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onSetSorting: OnChangeFn<SortingState>;
  onClearSearch: () => Promise<void>;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleColumnVisibility: OnChangeFn<VisibilityState>;
  onColumnResizing: OnChangeFn<ColumnSizingState>;
};

export type TableFiltersConfig = {
  id: number;
  label: FilterLabel;
  filterKey: FilterKey;
  filterType?: FilterType;
  options: DropdownOption[];
};

export type RowHighlightInfo = {
  isHighlighted: boolean;
  highlightStyles: string;
};
