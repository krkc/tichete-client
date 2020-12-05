import { ApolloCache, Cache, FetchResult, MutationOptions, WatchQueryOptions } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseModel } from '../models/base-model';

export interface BaseServiceConfig {
  className: { singular: string, plural: string };
  getResourceQuery: WatchQueryOptions;
  getResourcesQuery: WatchQueryOptions;
  deleteResourceQuery: MutationOptions;
}

export abstract class BaseService<T extends BaseModel> {
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
      return fetchResult.data[this.singularClassNameToCamelCase()] as T;
    }));
  };

  public getMany = (take: number = 10) => {
    return this.apollo.watchQuery({
      query: this.config.getResourcesQuery.query,
      variables: { take }
    })
      .valueChanges.pipe(map(fetchResult => {
        return fetchResult.data[this.pluralClassNameToCamelCase()] as T[];
    }));
  };

  public delete = (resources: T[]) => {
    return this.apollo.mutate({
      mutation: this.config.deleteResourceQuery.mutation,
      variables: {
        ids: resources.map(r => r.id),
      },
      update: (cacheStore) => this.updateCache(cacheStore, { data: { removeTicket: resources } }),
    });
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

          resources = cachedResources ? cachedResources[this.pluralClassNameToCamelCase()] : [];
        } catch (error) {
          // If you visit the ticket create page without first coming from the index page,
          // the cache will be empty and (annoyingly) it throws an error. This doesn't seem to occur
          // on the user create page. In that case, readQuery just returns null. Not sure yet why
          // the inconsistency.
          if (error.message !== `Can't find field '${this.pluralClassNameToCamelCase()}' on ROOT_QUERY object`) throw error;

          resources = [];
        }

        queryOut.data[this.pluralClassNameToCamelCase()] = resources.concat(mutatedResource);
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

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError = <T>(result?: T) => {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private singularClassNameToCamelCase() {
    return this.config.className.singular.replace(/^(.)/, function($1) { return $1.toLowerCase(); });
  }

  private pluralClassNameToCamelCase() {
    return this.config.className.plural.replace(/^(.)/, function($1) { return $1.toLowerCase(); });
  }
}
