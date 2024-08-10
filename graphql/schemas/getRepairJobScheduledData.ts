import gql from 'graphql-tag';

export const GET_CALENDAR_EVENTS = gql`
  query GET_CALENDAR_EVENTS {
    getCalendarEvents {
      allDay
      end
      id
      start
      title
      description
    }
  }
`;
