import { gql } from 'apollo-angular';

const ticketMin = gql`
  fragment ticketMin on Ticket {
    __typename
    id
    name
    description
    createdAt
  }
`;

const userMin = gql`
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

const ticket = gql`
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
  ${ticketMin}
  ${userMin}
`;

const roleMin = gql`
  fragment roleMin on Role {
    __typename
    id
    name
    isSystemAdmin
    createdAt
  }
`;

const user = gql`
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
  ${userMin}
  ${ticketMin}
  ${roleMin}
`;

const permission = gql`
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

const role = gql`
  fragment role on Role {
    ...roleMin
    permissions { ...permission }
  }
  ${roleMin}
  ${permission}
`;

export const QUERY_FRAGMENTS = {
  ticket, user, ticketMin, userMin, role, roleMin, permission
};
