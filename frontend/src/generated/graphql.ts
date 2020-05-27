import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  createClient: Client;
};

export type MutationCreateClientArgs = {
  name: Scalars['String'];
  roles: Array<Scalars['String']>;
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID'];
  clientId: Scalars['ID'];
  name: Scalars['String'];
  isCircle: Scalars['Boolean'];
  purpose: Scalars['String'];
  domains: Scalars['String'];
  accountabilities: Scalars['String'];
};

export type Client = {
  __typename?: 'Client';
  id: Scalars['ID'];
  name: Scalars['String'];
  roles: Array<Role>;
};

export type Query = {
  __typename?: 'Query';
  clients: Array<Client>;
};

export type GetClientsQueryVariables = {};

export type GetClientsQuery = { __typename?: 'Query' } & {
  clients: Array<
    { __typename?: 'Client' } & Pick<Client, 'id' | 'name'> & {
        roles: Array<{ __typename?: 'Role' } & Pick<Role, 'id' | 'name'>>;
      }
  >;
};

export const GetClientsDocument = gql`
  query getClients {
    clients {
      id
      name
      roles {
        id
        name
      }
    }
  }
`;

/**
 * __useGetClientsQuery__
 *
 * To run a query within a React component, call `useGetClientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClientsQuery({
 *   variables: {
 *   },
 * });
 */
export const useGetClientsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<GetClientsQuery, GetClientsQueryVariables>,
) => ApolloReactHooks.useQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, baseOptions);
export const useGetClientsLazyQuery = (
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetClientsQuery, GetClientsQueryVariables>,
) => ApolloReactHooks.useLazyQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, baseOptions);
export type GetClientsQueryHookResult = ReturnType<typeof useGetClientsQuery>;
export type GetClientsLazyQueryHookResult = ReturnType<typeof useGetClientsLazyQuery>;
export type GetClientsQueryResult = ApolloReactCommon.QueryResult<GetClientsQuery, GetClientsQueryVariables>;
