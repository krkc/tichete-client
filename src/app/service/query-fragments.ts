import { gql } from 'apollo-angular';

const TICKET = gql`
  fragment ticket on Ticket {
    __typename
    id
    name
    description
    createdAt
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
      }
    }
  }
`;

const USER = gql`
  fragment user on User {
    __typename
    id
    email
    username
    firstName
    lastName
    role {
      id
      name
    }
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
  TICKET, USER
}
