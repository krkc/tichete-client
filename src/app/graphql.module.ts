import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache,ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { JwtHelperService } from '@auth0/angular-jwt';

const uri = 'http://localhost:3000/graphql';

export function createApollo(
  httpLink: HttpLink,
  jwtHelper: JwtHelperService
) {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => {
    const token = jwtHelper.tokenGetter();

    if (token === null || jwtHelper.isTokenExpired()) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }
  });

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          displayName: (_, { readField }) => `${readField('firstName')} ${readField('lastName')}`,
        },
      }
    },
  });

  return {
    link,
    cache,
    fetchOptions: {
      mode: 'no-cors',
    },
  }
}

@NgModule({
  exports: [
    HttpClientModule,
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink, JwtHelperService]
  }]
})
export class GraphQLModule {}
