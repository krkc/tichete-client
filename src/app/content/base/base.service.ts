import { ApolloCache, Cache, DataProxy, FetchResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Base } from './base';

export interface BaseServiceConfig {
  className: { singular: string, plural: string };
  getResourceQuery: DataProxy.Query<any, unknown>;
  getResourcesQuery: DataProxy.Query<any, unknown>;
}

export abstract class BaseService<T extends Base> {
  constructor(
    protected apollo: Apollo,
    protected config: BaseServiceConfig,
  ) {}

  public getOne = (id: number) => {
    return this.apollo.watchQuery({
      query: this.config.getResourceQuery.query,
      variables: {
        id: id
      },
    }).valueChanges.pipe(map(fetchResult => {
      return fetchResult.data[this.config.className.singular.toLowerCase()] as T;
    }));
  };

  public getMany = (take: number = 10) => {
    return this.apollo.watchQuery({
      query: this.config.getResourcesQuery.query,
      variables: { take }
    })
      .valueChanges.pipe(map(fetchResult => {
        return fetchResult.data[this.config.className.plural.toLowerCase()] as T[];
    }));
  };

  protected updateCache = (cacheStore: ApolloCache<any>, { data }: FetchResult<any>) => {
    const mutationAction = Object.keys(data)[0];
    const mutatedResources: T[] = data[mutationAction];

    mutatedResources.forEach(mutatedResource => {
      if (mutationAction === `add${this.config.className.singular}`) {
        let queryOut = { query: undefined, variables: undefined, data: {} };
        queryOut.query = this.config.getResourcesQuery.query;
        queryOut.variables = { take: 10 };

        let resources: T[];
        try {
          const cachedResources = cacheStore.readQuery<T[]>({
            query: queryOut.query,
            variables: queryOut.variables,
          });

          resources = cachedResources ? cachedResources[this.config.className.plural.toLowerCase()] : [];
        } catch (error) {
          // If you visit the ticket create page without first coming from the index page,
          // the cache will be empty and (annoyingly) it throws an error. This doesn't seem to occur
          // on the user create page. In that case, readQuery just returns null. Not sure yet why
          // the inconsistency.
          if (error.message !== `Can't find field '${this.config.className.plural.toLowerCase()}' on ROOT_QUERY object`) throw error;

          resources = [];
        }

        queryOut.data[this.config.className.plural.toLowerCase()] = resources.concat(mutatedResource);
        cacheStore.writeQuery(queryOut);
        return;
      }

      const cacheId = cacheStore.identify(mutatedResource as any);

      if (mutationAction === `update${this.config.className.singular}`) {
        const modifyOptions: Cache.ModifyOptions = { id: cacheId, fields: {} };
        // modifyOptions.fields[this.className.singular.toLowerCase()] = (existingFieldCacheId: T, { toReference }) => {
        //   return toReference(cacheId);
        // };
        cacheStore.modify(modifyOptions);
      } else if (mutationAction === `remove${this.config.className.singular}`) {
        cacheStore.evict({ id: cacheId });
      }
    });
  }
}
