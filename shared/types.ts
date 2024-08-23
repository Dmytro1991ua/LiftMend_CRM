export type CalendarEventInfoPayload = {
  elevatorType: string;
  buildingName: string;
  elevatorLocation: string;
  jobType: string;
};

export type CalendarEventInfo = {
  title: string;
  description: string;
};

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

export type FormFieldConfig = {
  id: number;
  content: JSX.Element;
};
