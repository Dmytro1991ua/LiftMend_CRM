import gql from 'graphql-tag';

export const GET_CALENDAR_EVENTS = gql`
  query GetCalendarEvents {
    getCalendarEvents {
      allDay
      end
      id
      start
      title
      description
      repairJobId
    }
  }
`;
