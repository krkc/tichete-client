import { ApolloCache, Cache, DataProxy, FetchResult } from '@apollo/client/core';
import { Base } from './base';

export abstract class BaseService<T extends Base> {
  protected abstract className: { singular: string, plural: string };
  protected getResourceQuery: DataProxy.Query<any, unknown>;
  protected getResourcesQuery: DataProxy.Query<any, unknown>;

  protected updateCache = (cacheStore: ApolloCache<any>, { data }: FetchResult<any>) => {
    const mutationAction = Object.keys(data)[0];
    const mutatedResources: T[] = data[mutationAction];

    mutatedResources.forEach(mutatedResource => {
      if (mutationAction === `add${this.className.singular}`) {
        let queryOut = { query: undefined, variables: undefined, data: {} };
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

        queryOut.data[this.className.plural.toLowerCase()] = resources.concat(mutatedResource);
        cacheStore.writeQuery(queryOut);
        return;
      }

      const cacheId = cacheStore.identify(mutatedResource as any);

      if (mutationAction === `update${this.className.singular}`) {
        const modifyOptions: Cache.ModifyOptions = { id: cacheId, fields: {} };
        // modifyOptions.fields[this.className.singular.toLowerCase()] = (existingFieldCacheId: T, { toReference }) => {
        //   return toReference(cacheId);
        // };
        cacheStore.modify(modifyOptions);
      } else if (mutationAction === `remove${this.className.singular}`) {
        cacheStore.evict({ id: cacheId });
      }
    });
  }
}
