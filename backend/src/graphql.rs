use std::convert::From;
use std::sync::Arc;

use actix_web::{web, Error, HttpResponse};

use juniper::http::playground::playground_source;
use juniper::{http::GraphQLRequest, Executor, FieldResult};
use juniper_from_schema::graphql_schema_from_file;
use juniper_eager_loading::{prelude::*, LoadFrom, HasMany, LoadChildrenOutput};

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
            .execute(&executor.context().db_con)
            .and_then(|_| {
                 let model_role = roles::table
                 .filter(roles::client_id.eq(1).and(roles::id.eq(id_i32)))
                 .first::<models::Role>(&executor.context().db_con)?;

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
}

#[derive(Debug, Clone, PartialEq)]
pub struct Role {
    role: models::Role,

    roles: HasMany<Role>,
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

        Ok(())
    }
}
#[allow(missing_docs, dead_code)]
struct EagerLoadingContextRoleForRoles;

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

impl RoleFields for Role {
    fn field_id(&self, _: &Executor<'_, Context>) -> FieldResult<juniper::ID> {
        Ok(juniper::ID::new(self.role.id.to_string()))
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
    }).await
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
