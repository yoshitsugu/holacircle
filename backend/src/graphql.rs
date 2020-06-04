use std::convert::From;
use std::sync::Arc;

use actix_web::{web, Error, HttpResponse};

use juniper::http::playground::playground_source;
use juniper::{http::GraphQLRequest, Executor, FieldResult};
use juniper_from_schema::graphql_schema_from_file;
use juniper_eager_loading::{prelude::*, LoadFrom, HasMany, LoadChildrenOutput, HasManyThrough};

use diesel::prelude::*;

use itertools::Itertools;
use crate::{models, DbCon, DbPool};

graphql_schema_from_file!("src/schema.graphql");

pub struct Context {
    db_con: DbCon,
}
impl juniper::Context for Context {}

pub struct Query;
pub struct Mutation;

impl QueryFields for Query {
    fn field_role(
        &self,
        executor: &Executor<'_, Context>,
        trail: &QueryTrail<'_, Role, Walked>,
    ) -> FieldResult<Role> {
        use crate::schema::roles;
        
        
        let model_role = roles::table.filter(roles::client_id.eq(1).and(roles::role_id.is_null()))
            .first::<models::Role>(&executor.context().db_con)?;

        let role = Role::new_from_model(&model_role);
        Role::eager_load_all_children(
            role,
            &[model_role],
            &executor.context(),
            trail
        ).map_err(Into::into)
    }
}

impl MutationFields for Mutation {
    fn field_update_role(
        &self,
        executor: &Executor<'_, Context>,
        trail: &QueryTrail<'_, Role, Walked>,
        id: juniper::ID,
        name: String,
        purpose: String,
        domains: String,
        accountabilities: String,
    ) -> FieldResult<Role> {
        use crate::schema::roles;
        let id_i32 = id.to_string().parse::<i32>().unwrap();

        diesel::update(roles::table)
            .filter(roles::client_id.eq(1).and(roles::id.eq(id_i32)))
            .set((
                roles::name.eq(name),
                roles::purpose.eq(purpose),
                roles::domains.eq(domains),
                roles::accountabilities.eq(accountabilities),
            ))
            .get_result::<models::Role>(&executor.context().db_con)
            .and_then(|model_role| {
                 let role = Role::new_from_model(&model_role);
                 Role::eager_load_all_children(
                     role,
                     &[model_role],
                     &executor.context(),
                     trail
                 ).map_err(Into::into)
                }
            )
            .map_err(Into::into)
    }


    fn field_new_role(
        &self,
        executor: &Executor<'_, Context>,
        trail: &QueryTrail<'_, Role, Walked>,
        name: String,
        is_circle: bool,
        purpose: String,
        domains: String,
        accountabilities: String,
        role_id: juniper::ID,
    ) -> FieldResult<Role> {
        use crate::schema::roles;
        let role_id_i32 = role_id.to_string().parse::<i32>().unwrap();

        let new_role = models::NewRole {
            client_id: 1,
            role_id: Some(role_id_i32),
            name,
            is_circle,
            purpose,
            domains,
            accountabilities,
        };

        diesel::insert_into(roles::table)
            .values(&new_role)
            .get_result(&executor.context().db_con)
            .and_then(|model_role| {
                let role = Role::new_from_model(&model_role);
                Role::eager_load_all_children(
                    role,
                    &[model_role],
                    &executor.context(),
                    trail
                ).map_err(Into::into)
            })
            .map_err(Into::into)
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct User {
    id: i32,
    name: String,
    email: String
}

#[derive(Debug, Clone, PartialEq)]
pub struct Role {
    role: models::Role,

    roles: HasMany<Role>,
      
    members: HasManyThrough<User>,
}

impl LoadFrom<models::Role> for models::Role {
    type Error = diesel::result::Error;
    type Context = Context;

    fn load(
        role_models: &[models::Role],
        _field_args: &(),
        context: &Self::Context,
    ) -> Result<Vec<models::Role>, Self::Error> {
        use crate::schema::roles;

        let role_ids = role_models
            .iter()
            .map(|role| role.id)
            .collect_vec();

        roles::table
            .filter(roles::role_id.eq_any(role_ids))
            .load::<models::Role>(&context.db_con)
    }
}

impl GraphqlNodeForModel for Role {
    type Model = models::Role;
    type Id = i32;
    type Context = Context;
    type Error = diesel::result::Error;

    fn new_from_model(model: &Self::Model) -> Self {
        Self {
            role: model.clone(),
            roles: Default::default(),
            members: Default::default(),
        }
    }
}

impl EagerLoadAllChildren for Role {
    fn eager_load_all_children_for_each(
        nodes: &mut [Self],
        models: &[Self::Model],
        ctx: &Self::Context,
        trail: &QueryTrail<'_, Self, Walked>,
    ) -> Result<(), Self::Error> {
        if let Some(child_trail) = trail.roles().walk() {
            let field_args = trail.roles_args();

            EagerLoadChildrenOfType::<
                Role,
                EagerLoadingContextRoleForRoles,
                _,
            >::eager_load_children(nodes, models, ctx, &child_trail, &field_args)?;
        }

        if let Some(child_trail) = trail.members().walk() {
            let field_args = trail.members_args();

            EagerLoadChildrenOfType::<
                User,
                EagerLoadingContextRoleForMembers,
                _
            >::eager_load_children(nodes, models, ctx, &child_trail, &field_args)?;
        }

        Ok(())
    }
}

#[allow(missing_docs, dead_code)]
struct EagerLoadingContextRoleForRoles;

#[allow(missing_docs, dead_code)]
struct EagerLoadingContextRoleForMembers;

impl<'a>
    EagerLoadChildrenOfType<
        'a,
        Role,
        EagerLoadingContextRoleForRoles,
        ()
    > for Role
{
    type FieldArguments = ();

    fn load_children(
        models: &[Self::Model],
        field_args: &Self::FieldArguments,
        ctx: &Self::Context,
    ) -> Result<
        LoadChildrenOutput<<Role as juniper_eager_loading::GraphqlNodeForModel>::Model>,
        Self::Error,
    > {
        let child_models: Vec<models::Role> = LoadFrom::load(&models, field_args, ctx)?;
        Ok(LoadChildrenOutput::ChildModels(child_models))
    }

    fn is_child_of(
        node: &Self,
        child: &Role,
        _join_model: &(), _field_args: &Self::FieldArguments,
        _ctx: &Self::Context,
    ) -> bool {
        Some(node.role.id) == child.role.role_id
    }

    fn association(node: &mut Self) -> &mut dyn Association<Role> {
        &mut node.roles
    }
}

impl LoadFrom<models::Member> for models::User {
    type Error = diesel::result::Error;
    type Context = Context;

    fn load(
        members: &[models::Member],
        _field_args: &(),
        ctx: &Context,
    ) -> Result<Vec<Self>, Self::Error> {
        use crate::schema::users::dsl::*;
        use diesel::pg::expression::dsl::any;
        
        let user_ids = members
            .iter()
            .map(|member| member.user_id)
            .collect::<Vec<_>>();
                
        users
            .filter(id.eq(any(&user_ids)))
            .load::<models::User>(&ctx.db_con)
    }
}

impl LoadFrom<models::Role> for models::Member {
    type Error = diesel::result::Error;
    type Context = Context;

    fn load(
        roles: &[models::Role],
        _field_args: &(),
        ctx: &Context,
    ) -> Result<Vec<Self>, Self::Error> {
        use crate::schema::members::dsl::*;
        use diesel::pg::expression::dsl::any;

        let role_ids = roles.iter().map(|role| role.id).collect::<Vec<_>>();

        members
            .filter(role_id.eq(any(role_ids)))
            .load::<models::Member>(&ctx.db_con)
    }
}

impl<'a>
    EagerLoadChildrenOfType<
        'a,
        User,
        EagerLoadingContextRoleForMembers,
        models::Member>
    for Role
{
    type FieldArguments = ();

    #[allow(unused_variables)]
    fn load_children(
        models: &[Self::Model],
        field_args: &Self::FieldArguments,
        ctx: &Self::Context,
    ) -> Result<LoadChildrenOutput<models::User, models::Member>, Self::Error> {
        let join_models: Vec<models::Member> = LoadFrom::load(&models, field_args, ctx)?;
        let child_models: Vec<models::User> = LoadFrom::load(&join_models, field_args, ctx)?;

        let mut child_and_join_model_pairs = Vec::new();

        for join_model in join_models {
            for child_model in &child_models {
                if join_model.user_id == child_model.id {
                    let pair = (child_model.clone(), join_model.clone());
                    child_and_join_model_pairs.push(pair);
                }
            }
        }
        
        Ok(LoadChildrenOutput::ChildAndJoinModels(
            child_and_join_model_pairs,
        ))
    }

    fn is_child_of(
        node: &Self,
        child: &User,
        join_model: &models::Member,
        _field_args: &Self::FieldArguments,
        _ctx: &Self::Context,
    ) -> bool {
        node.role.id == join_model.role_id && join_model.user_id == child.id
    }

    fn association(node: &mut Self) -> &mut dyn Association<User> {
        &mut node.members
    }
}


impl GraphqlNodeForModel for User {
    type Model = models::User;
    type Id = i32;
    type Context = Context;
    type Error = diesel::result::Error;

    fn new_from_model(model: &Self::Model) -> Self {
        Self {
            id: model.id,
            name: model.name.to_string(),
            email: model.email.to_string()
        }
    }
}

impl EagerLoadAllChildren for User {
    fn eager_load_all_children_for_each(
        _nodes: &mut [Self],
        _models: &[Self::Model],
        _ctx: &Self::Context,
        _trail: &juniper_from_schema::QueryTrail<'_, Self, juniper_from_schema::Walked>,
    ) -> Result<(), Self::Error> {
        Ok(())
    }
}

impl RoleFields for Role {
    fn field_id(&self, _: &Executor<'_, Context>) -> FieldResult<juniper::ID> {
        Ok(juniper::ID::new(self.role.id.to_string()))
    }

    fn field_role_id(&self, _: &Executor<'_, Context>) -> FieldResult<Option<juniper::ID>> {
        match self.role.role_id {
          Some(role_id) => Ok(Some(juniper::ID::new(role_id.to_string()))),
          None => Ok(None)
        }
    }

    fn field_name(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.role.name)
    }

    fn field_is_circle(&self, _: &Executor<'_, Context>) -> FieldResult<&bool> {
        Ok(&self.role.is_circle)
    }

    fn field_purpose(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.role.purpose)
    }

    fn field_domains(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.role.domains)
    }

    fn field_accountabilities(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.role.accountabilities)
    }

    fn field_roles(
        &self, 
        _executor: &Executor<'_, Context>,
        _trail: &QueryTrail<'_, Role, Walked>,
    ) -> FieldResult<&Vec<Role>> {
        self.roles.try_unwrap().map_err(From::from)
    }

    fn field_members(
        &self, 
        _executor: &Executor<'_, Context>,
        _trail: &QueryTrail<'_, User, Walked>,
    ) -> FieldResult<&Vec<User>> {
        self.members.try_unwrap().map_err(From::from)
    }

}

impl UserFields for User {
    fn field_id(&self, _: &Executor<'_, Context>) -> FieldResult<juniper::ID> {
        Ok(juniper::ID::new(self.id.to_string()))
    }

    fn field_name(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.name)
    }

    fn field_email(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.email)
    }
}


fn playground() -> HttpResponse {
    let html = playground_source("");
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(html)
}

async fn graphql(
    schema: web::Data<Arc<Schema>>,
    data: web::Json<GraphQLRequest>,
    db_pool: web::Data<DbPool>,
) -> Result<HttpResponse, Error> {
    let ctx = Context {
        db_con: db_pool.get().unwrap(),
    };

    web::block(move || {
        let res = data.execute(&schema, &ctx);
        Ok::<_, serde_json::error::Error>(serde_json::to_string(&res)?)
    })
    .await
    .map_err(Into::into)
    .and_then(|client| {
        Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(client))
    })
}

pub fn register(config: &mut web::ServiceConfig) {
    let schema = std::sync::Arc::new(Schema::new(Query, Mutation));

    config
        .data(schema)
        .route("/graphql", web::post().to(graphql))
        .route("/graphql", web::get().to(playground));
}
