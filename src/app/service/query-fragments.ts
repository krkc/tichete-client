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

const ROLEMIN = gql`
  fragment roleMin on Role {
    __typename
    id
    name
    isSystemAdmin
    createdAt
  }
`;

const USER = gql`
  fragment user on User {
    ...userMin
    role { ...roleMin }
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
  ${ROLEMIN}
`;

const PERMISSION = gql`
  fragment permission on Permission {
    __typename
    id
    resourceName
    creatorOnly
    canCreate
    canRead
    canUpdate
    canDelete
    roleId
  }
`;

const ROLE = gql`
  fragment role on Role {
    ...roleMin
    permissions { ...permission }
  }
  ${ROLEMIN}
  ${PERMISSION}
`;

export const QueryFragments = {
  TICKET, USER, TICKETMIN, USERMIN, ROLE, ROLEMIN, PERMISSION
}
