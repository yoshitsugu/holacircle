use std::convert::From;
use std::sync::Arc;

use actix_web::{web, Error, HttpResponse};

use juniper::{http::GraphQLRequest, Executor, FieldResult, graphiql::graphiql_source};
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
        
        roles::table.filter(roles::client_id.eq(1).and(roles::role_id.is_null()))
            .first::<crate::models::Role>(&executor.context().db_con)
            .map(Into::into)
            .map_err(|e| format!("QueryFields: {:?}", e).into() )
    }
}

impl MutationFields for Mutation {
    fn field_create_client(
        &self,
        executor: &Executor<'_, Context>,
        _trail: &QueryTrail<'_, Client, Walked>,
        name: String,
        roles: Vec<String>,
    ) -> FieldResult<Client> {
        use crate::schema::{clients, roles};

        let new_client = crate::models::NewClient { name: name };

        diesel::insert_into(clients::table)
            .values(&new_client)
            .execute(&executor.context().db_con)
            .and_then(|_| 
                 clients::table
                .order(clients::id.desc())
                .first::<crate::models::Client>(&executor.context().db_con)
                .and_then(|client| {
                    let values = roles
                    .into_iter()
                    .map(|role| (
                        roles::client_id.eq(&client.id),
                    roles::name.eq(role),
                    roles::purpose.eq(""),
                    roles::domains.eq(""),
                    roles::accountabilities.eq("")))
                    .collect_vec();
    
                    diesel::insert_into(roles::table)
                    .values(&values)
                    .execute(&executor.context().db_con)?;

                    Ok(client.into())
                })
                .map_err(Into::into)
            )
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

    fn field_roles(&self,  executor: &Executor<'_, Context>,
           _trail: &QueryTrail<'_, Role, Walked>,) -> FieldResult<Vec<Role>> {
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

    fn field_roles(&self,  executor: &Executor<'_, Context>,
           _trail: &QueryTrail<'_, Role, Walked>,) -> FieldResult<Vec<Role>> {
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

async fn graphiql() -> HttpResponse {
    let html = graphiql_source("/graphql");
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
        .service(web::resource("/graphql").route(web::post().to(graphql)))
        .service(web::resource("/graphiql").route(web::get().to(graphiql)));
}
