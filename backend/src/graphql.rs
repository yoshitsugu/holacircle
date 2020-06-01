use std::convert::From;
use std::sync::Arc;

use actix_web::{web, Error, HttpResponse};

use juniper::http::playground::playground_source;
use juniper::{http::GraphQLRequest, Executor, FieldResult};
use juniper_from_schema::graphql_schema_from_file;

use diesel::prelude::*;

use itertools::Itertools;

use crate::{DbCon, DbPool};

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
        _trail: &QueryTrail<'_, Role, Walked>,
    ) -> FieldResult<Role> {
        use crate::schema::roles;

        roles::table
            .filter(roles::client_id.eq(1).and(roles::role_id.is_null()))
            .first::<crate::models::Role>(&executor.context().db_con)
            .map(Into::into)
            .map_err(|e| format!("QueryFields: {:?}", e).into())
    }
}

impl MutationFields for Mutation {
    fn field_update_role(
        &self,
        executor: &Executor<'_, Context>,
        _trail: &QueryTrail<'_, Role, Walked>,
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
                roles::table
                    .filter(roles::client_id.eq(1).and(roles::id.eq(id_i32)))
                    .first::<crate::models::Role>(&executor.context().db_con)
                    .map(Into::into)
                    .map_err(Into::into)
            })
            .map_err(Into::into)
    }
    fn field_new_role(
        &self,
        executor: &Executor<'_, Context>,
        _trail: &QueryTrail<'_, Role, Walked>,
        name: String,
        purpose: String,
        domains: String,
        accountabilities: String,
        role_id: juniper::ID,
    ) -> FieldResult<Role> {
        use crate::schema::roles;
        let role_id_i32 = role_id.to_string().parse::<i32>().unwrap();

        diesel::insert_into(roles::table)
            .values((
                roles::client_id.eq(1),
                roles::name.eq(name),
                roles::purpose.eq(purpose),
                roles::domains.eq(domains),
                roles::accountabilities.eq(accountabilities),
                roles::role_id.eq(role_id_i32),
            ))
            .execute(&executor.context().db_con)
            .and_then(|_| {
                // diesel && mysql でinsert_intoでINSERTしたレコードを取得する方法ある？？
                // わからなかったので、一旦バグってるがidの降順で最新の１件を取得して返す
                roles::table
                    .order(roles::id.desc())
                    .first::<crate::models::Role>(&executor.context().db_con)
                    .map(Into::into)
                    .map_err(Into::into)
            })
            .map_err(Into::into)
    }
}

pub struct Client {
    id: i32,
    name: String,
}

pub struct Role {
    id: i32,
    name: String,
    is_circle: bool,
    purpose: String,
    domains: String,
    accountabilities: String,
}

impl ClientFields for Client {
    fn field_id(&self, _: &Executor<'_, Context>) -> FieldResult<juniper::ID> {
        Ok(juniper::ID::new(self.id.to_string()))
    }

    fn field_name(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.name)
    }

    fn field_roles(
        &self,
        executor: &Executor<'_, Context>,
        _trail: &QueryTrail<'_, Role, Walked>,
    ) -> FieldResult<Vec<Role>> {
        use crate::schema::roles;
        roles::table
            .filter(roles::client_id.eq(&self.id))
            .load::<crate::models::Role>(&executor.context().db_con)
            .and_then(|tags| Ok(tags.into_iter().map_into().collect()))
            .map_err(Into::into)
    }
}

impl From<crate::models::Client> for Client {
    fn from(client: crate::models::Client) -> Self {
        Self {
            id: client.id,
            name: client.name,
        }
    }
}

impl RoleFields for Role {
    fn field_id(&self, _: &Executor<'_, Context>) -> FieldResult<juniper::ID> {
        Ok(juniper::ID::new(self.id.to_string()))
    }

    fn field_name(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.name)
    }

    fn field_is_circle(&self, _: &Executor<'_, Context>) -> FieldResult<&bool> {
        Ok(&self.is_circle)
    }

    fn field_purpose(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.purpose)
    }

    fn field_domains(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.domains)
    }

    fn field_accountabilities(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.accountabilities)
    }

    fn field_roles(
        &self,
        executor: &Executor<'_, Context>,
        _trail: &QueryTrail<'_, Role, Walked>,
    ) -> FieldResult<Vec<Role>> {
        use crate::schema::roles;
        roles::table
            .filter(roles::role_id.eq(&self.id))
            .load::<crate::models::Role>(&executor.context().db_con)
            .and_then(|tags| Ok(tags.into_iter().map_into().collect()))
            .map_err(|e| format!("roles!! {:?}", e).into())
    }
}

impl From<crate::models::Role> for Role {
    fn from(role: crate::models::Role) -> Self {
        Self {
            id: role.id,
            name: role.name,
            is_circle: role.is_circle,
            purpose: role.purpose,
            domains: role.domains,
            accountabilities: role.accountabilities,
        }
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
