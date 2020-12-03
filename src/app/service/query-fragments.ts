import { gql } from 'apollo-angular';

const TICKETMIN = gql`
  fragment ticketMin on Ticket {
    __typename
    id
    name
    description
    createdAt
  }
`;

const USERMIN = gql`
  fragment userMin on User {
    __typename
    id
    email
    username
    firstName
    lastName
    displayName @client
  }
`;

const TICKET = gql`
  fragment ticket on Ticket {
    ...ticketMin
    creator {
      id
      email
    }
    status {
      id
      name
    }
    tags {
      id
      category {
        id
        name
      }
    }
    assignments {
      id
      user { ...userMin }
    }
  }
  ${TICKETMIN}
  ${USERMIN}
`;

const USER = gql`
  fragment user on User {
    ...userMin
    submittedTickets {
      id
      name
      description
    }
    assignments {
      id
      ticket { ...ticketMin }
    }
    subscriptions {
      id
      category {
        id
        name
      }
    }
  }
  ${USERMIN}
  ${TICKETMIN}
`;

export const QueryFragments = {
  TICKET, USER, TICKETMIN, USERMIN
}
