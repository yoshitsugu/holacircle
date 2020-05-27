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
  name: Scalars['String'];
  isCircle: Scalars['Boolean'];
  purpose: Scalars['String'];
  domains: Scalars['String'];
  accountabilities: Scalars['String'];
  roles: Array<Role>;
};

export type Client = {
  __typename?: 'Client';
  id: Scalars['ID'];
  name: Scalars['String'];
  roles: Array<Role>;
};

export type Query = {
  __typename?: 'Query';
  role: Role;
};

export type GetRolesQueryVariables = {};

export type GetRolesQuery = { __typename?: 'Query' } & {
  role: { __typename?: 'Role' } & {
    roles: Array<
      { __typename?: 'Role' } & {
        roles: Array<
          { __typename?: 'Role' } & {
            roles: Array<
              { __typename?: 'Role' } & {
                roles: Array<
                  { __typename?: 'Role' } & {
                    roles: Array<{ __typename?: 'Role' } & RoleFieldsFragment>;
                  } & RoleFieldsFragment
                >;
              } & RoleFieldsFragment
            >;
          } & RoleFieldsFragment
        >;
      } & RoleFieldsFragment
    >;
  } & RoleFieldsFragment;
};

export type RoleFieldsFragment = { __typename?: 'Role' } & Pick<
  Role,
  'id' | 'name' | 'isCircle' | 'purpose' | 'domains' | 'accountabilities'
>;

export const RoleFieldsFragmentDoc = gql`
  fragment roleFields on Role {
    id
    name
    isCircle
    purpose
    domains
    accountabilities
  }
`;
export const GetRolesDocument = gql`
  query getRoles {
    role {
      ...roleFields
      roles {
        ...roleFields
        roles {
          ...roleFields
          roles {
            ...roleFields
            roles {
              ...roleFields
              roles {
                ...roleFields
              }
            }
          }
        }
      }
    }
  }
  ${RoleFieldsFragmentDoc}
`;

/**
 * __useGetRolesQuery__
 *
 * To run a query within a React component, call `useGetRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolesQuery({
 *   variables: {
 *   },
 * });
 */
export const useGetRolesQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<GetRolesQuery, GetRolesQueryVariables>,
) => ApolloReactHooks.useQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, baseOptions);
export const useGetRolesLazyQuery = (
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>,
) => ApolloReactHooks.useLazyQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, baseOptions);
export type GetRolesQueryHookResult = ReturnType<typeof useGetRolesQuery>;
export type GetRolesLazyQueryHookResult = ReturnType<typeof useGetRolesLazyQuery>;
export type GetRolesQueryResult = ApolloReactCommon.QueryResult<GetRolesQuery, GetRolesQueryVariables>;
