import { ApolloCache, DataProxy, FetchResult } from '@apollo/client/core';
import { Base } from './base';

export abstract class BaseService<T extends Base> {
  protected abstract className: { singular: string, plural: string };
  protected getResourceQuery: DataProxy.Query<any, unknown>;
  protected getResourcesQuery: DataProxy.Query<any, unknown>;

  protected updateCache = (cacheStore: ApolloCache<any>, { data }: FetchResult<any>) => {
    const mutationAction = Object.keys(data)[0];
    const mutatedResources: T[] = data[mutationAction];

    mutatedResources.forEach(mutatedResource => {
      let queryOut = { query: undefined, variables: undefined, data: {} };

      if (mutationAction === `update${this.className.singular}`) {
        queryOut.data[this.className.singular.toLowerCase()] = mutatedResource;
        queryOut.query = this.getResourceQuery.query;
        queryOut.variables = { id: mutatedResource.id }
      } else {
        queryOut.query = this.getResourcesQuery.query;
        queryOut.variables = { take: 10 };

        const cachedResources = cacheStore.readQuery<T[]>({
          query: queryOut.query,
          variables: queryOut.variables,
        });

        const resources: T[] = cachedResources[this.className.plural.toLowerCase()];
        if (mutationAction === `remove${this.className.singular}`) {
          queryOut.data[this.className.plural.toLowerCase()] = resources.filter(resource => resource.id !== mutatedResource.id);
        } else if (mutationAction === `add${this.className.singular}`) {
          queryOut.data[this.className.plural.toLowerCase()] = resources.concat(mutatedResource);
        }
      }

      cacheStore.writeQuery(queryOut);
    });
  }
}
