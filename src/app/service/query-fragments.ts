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
      user {
        id
        email
        displayName @client
        firstName
        lastName
      }
    }
  }
  ${TICKETMIN}
`;

const USER = gql`
  fragment user on User {
    __typename
    id
    email
    username
    firstName
    lastName
    displayName @client
    submittedTickets {
      id
      name
      description
    }
    assignments {
      id
      ticket {
        id
        name
        description
      }
    }
    subscriptions {
      id
      category {
        id
        name
      }
    }
  }
`;

export const QueryFragments = {
  TICKET, USER, TICKETMIN
}
