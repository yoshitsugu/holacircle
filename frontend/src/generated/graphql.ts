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
  updateRole: Role;
  newRole: Role;
};

export type MutationUpdateRoleArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
  purpose: Scalars['String'];
  domains: Scalars['String'];
  accountabilities: Scalars['String'];
};

export type MutationNewRoleArgs = {
  name: Scalars['String'];
  isCircle: Scalars['Boolean'];
  purpose: Scalars['String'];
  domains: Scalars['String'];
  accountabilities: Scalars['String'];
  roleId: Scalars['ID'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID'];
  name: Scalars['String'];
  roleId?: Maybe<Scalars['ID']>;
  isCircle: Scalars['Boolean'];
  purpose: Scalars['String'];
  domains: Scalars['String'];
  accountabilities: Scalars['String'];
  roles: Array<Role>;
  members: Array<User>;
};

export type Query = {
  __typename?: 'Query';
  role: Role;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
};

export type GetRolesQueryVariables = {};

export type GetRolesQuery = { __typename?: 'Query' } & {
  role: { __typename?: 'Role' } & {
    members: Array<{ __typename?: 'User' } & UserFieldsFragment>;
    roles: Array<
      { __typename?: 'Role' } & {
        members: Array<{ __typename?: 'User' } & UserFieldsFragment>;
        roles: Array<
          { __typename?: 'Role' } & {
            members: Array<{ __typename?: 'User' } & UserFieldsFragment>;
            roles: Array<
              { __typename?: 'Role' } & {
                members: Array<{ __typename?: 'User' } & UserFieldsFragment>;
                roles: Array<
                  { __typename?: 'Role' } & {
                    members: Array<{ __typename?: 'User' } & UserFieldsFragment>;
                    roles: Array<
                      { __typename?: 'Role' } & {
                        members: Array<{ __typename?: 'User' } & UserFieldsFragment>;
                      } & RoleFieldsFragment
                    >;
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
  'id' | 'roleId' | 'name' | 'isCircle' | 'purpose' | 'domains' | 'accountabilities'
>;

export type UserFieldsFragment = { __typename?: 'User' } & Pick<User, 'id' | 'name' | 'email'>;

export type UpdateRoleMutationVariables = {
  id: Scalars['ID'];
  name: Scalars['String'];
  purpose: Scalars['String'];
  domains: Scalars['String'];
  accountabilities: Scalars['String'];
};

export type UpdateRoleMutation = { __typename?: 'Mutation' } & {
  updateRole: { __typename?: 'Role' } & RoleFieldsFragment;
};

export type NewRoleMutationVariables = {
  name: Scalars['String'];
  isCircle: Scalars['Boolean'];
  purpose: Scalars['String'];
  domains: Scalars['String'];
  accountabilities: Scalars['String'];
  roleId: Scalars['ID'];
};

export type NewRoleMutation = { __typename?: 'Mutation' } & { newRole: { __typename?: 'Role' } & RoleFieldsFragment };

export const RoleFieldsFragmentDoc = gql`
  fragment roleFields on Role {
    id
    roleId
    name
    isCircle
    purpose
    domains
    accountabilities
  }
`;
export const UserFieldsFragmentDoc = gql`
  fragment userFields on User {
    id
    name
    email
  }
`;
export const GetRolesDocument = gql`
  query getRoles {
    role {
      ...roleFields
      members {
        ...userFields
      }
      roles {
        ...roleFields
        members {
          ...userFields
        }
        roles {
          ...roleFields
          members {
            ...userFields
          }
          roles {
            ...roleFields
            members {
              ...userFields
            }
            roles {
              ...roleFields
              members {
                ...userFields
              }
              roles {
                ...roleFields
                members {
                  ...userFields
                }
              }
            }
          }
        }
      }
    }
  }
  ${RoleFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
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
export const UpdateRoleDocument = gql`
  mutation updateRole($id: ID!, $name: String!, $purpose: String!, $domains: String!, $accountabilities: String!) {
    updateRole(id: $id, name: $name, purpose: $purpose, domains: $domains, accountabilities: $accountabilities) {
      ...roleFields
    }
  }
  ${RoleFieldsFragmentDoc}
`;
export type UpdateRoleMutationFn = ApolloReactCommon.MutationFunction<UpdateRoleMutation, UpdateRoleMutationVariables>;

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleMutation, { data, loading, error }] = useUpdateRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      purpose: // value for 'purpose'
 *      domains: // value for 'domains'
 *      accountabilities: // value for 'accountabilities'
 *   },
 * });
 */
export const useUpdateRoleMutation = (
  baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>,
) => ApolloReactHooks.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, baseOptions);
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = ApolloReactCommon.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateRoleMutation,
  UpdateRoleMutationVariables
>;
export const NewRoleDocument = gql`
  mutation newRole(
    $name: String!
    $isCircle: Boolean!
    $purpose: String!
    $domains: String!
    $accountabilities: String!
    $roleId: ID!
  ) {
    newRole(
      name: $name
      isCircle: $isCircle
      purpose: $purpose
      domains: $domains
      accountabilities: $accountabilities
      roleId: $roleId
    ) {
      ...roleFields
    }
  }
  ${RoleFieldsFragmentDoc}
`;
export type NewRoleMutationFn = ApolloReactCommon.MutationFunction<NewRoleMutation, NewRoleMutationVariables>;

/**
 * __useNewRoleMutation__
 *
 * To run a mutation, you first call `useNewRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newRoleMutation, { data, loading, error }] = useNewRoleMutation({
 *   variables: {
 *      name: // value for 'name'
 *      isCircle: // value for 'isCircle'
 *      purpose: // value for 'purpose'
 *      domains: // value for 'domains'
 *      accountabilities: // value for 'accountabilities'
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export const useNewRoleMutation = (
  baseOptions?: ApolloReactHooks.MutationHookOptions<NewRoleMutation, NewRoleMutationVariables>,
) => ApolloReactHooks.useMutation<NewRoleMutation, NewRoleMutationVariables>(NewRoleDocument, baseOptions);
export type NewRoleMutationHookResult = ReturnType<typeof useNewRoleMutation>;
export type NewRoleMutationResult = ApolloReactCommon.MutationResult<NewRoleMutation>;
export type NewRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<NewRoleMutation, NewRoleMutationVariables>;
