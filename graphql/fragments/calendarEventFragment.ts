import gql from 'graphql-tag';

export const CALENDAR_EVENT_FRAGMENT = gql`
  fragment CalendarEventFields on CalendarEvent {
    id
    title
    start
    end
    description
    allDay
  }
`;
