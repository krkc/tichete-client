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
        queryOut.query = this.getResourceQuery.query;
        queryOut.variables = { id: mutatedResource.id }
        queryOut.data[this.className.singular.toLowerCase()] = mutatedResource;
      } else {
        queryOut.query = this.getResourcesQuery.query;
        queryOut.variables = { take: 10 };

        let resources: T[];
        try {
          const cachedResources = cacheStore.readQuery<T[]>({
            query: queryOut.query,
            variables: queryOut.variables,
          });

          resources = cachedResources ? cachedResources[this.className.plural.toLowerCase()] : [];
        } catch (error) {
          // If you visit the ticket create page without first coming from the index page,
          // the cache will be empty and (annoyingly) it throws an error. This doesn't seem to occur
          // on the user create page. In that case, readQuery just returns null. Not sure yet why
          // the inconsistency.
          if (error.message !== `Can't find field '${this.className.plural.toLowerCase()}' on ROOT_QUERY object`) throw error;

          resources = [];
        }

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
