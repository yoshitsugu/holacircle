use std::convert::From;
use std::sync::Arc;

use actix_web::{web, Error, HttpResponse};

use juniper::http::playground::playground_source;
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
    fn field_clients(
        &self,
        executor: &Executor<'_, Context>,
        _trail: &QueryTrail<'_, Client, Walked>,
    ) -> FieldResult<Vec<Client>> {
        use crate::schema::clients;

        clients::table
            .load::<crate::models::Client>(&executor.context().db_con)
            .and_then(|clients| Ok(clients.into_iter().map_into().collect()))
            .map_err(Into::into)
    }
}

impl MutationFields for Mutation {
    fn field_create_client(
        &self,
        executor: &Executor<'_, Context>,
        _trail: &QueryTrail<'_, Client, Walked>,
        name: String,
    ) -> FieldResult<Client> {
        use crate::schema::clients;

        let new_client = crate::models::NewClient { name: name };

        diesel::insert_into(clients::table)
            .values(&new_client)
            .execute(&executor.context().db_con)
            .and_then(|_| 
                clients::table
                .order(clients::id.desc())
                .first::<crate::models::Client>(&executor.context().db_con)
                .map(Into::into)
                .map_err(Into::into)
            )
            .map_err(Into::into)
    }
}

pub struct Client {
    id: i32,
    name: String,
}

impl ClientFields for Client {
    fn field_id(&self, _: &Executor<'_, Context>) -> FieldResult<juniper::ID> {
        Ok(juniper::ID::new(self.id.to_string()))
    }

    fn field_name(&self, _: &Executor<'_, Context>) -> FieldResult<&String> {
        Ok(&self.name)
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

fn playground() -> HttpResponse {
    let html = playground_source("");
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(html)
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
        .service(
            web::resource("/graphql")
              .route(web::post().to(graphql))
              .route(web::get().to(playground))
        )
        .service(web::resource("/graphiql").route(web::get().to(graphiql)));
}
