#[macro_use]
extern crate diesel;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer, HttpResponse};

use diesel::{
    prelude::*,
    r2d2::{self, ConnectionManager},
};

pub mod graphql;
pub mod models;
pub mod schema;

pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;
pub type DbCon = r2d2::PooledConnection<ConnectionManager<MysqlConnection>>;


#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let db_pool = create_db_pool();
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8000);

    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));

    HttpServer::new(move || {
        App::new()
            .data(db_pool.clone())
            .wrap(Cors::new().finish())
            .configure(graphql::register)
            .default_service(web::route().to(HttpResponse::NotFound))
    })
    .bind(addr)?
    .run()
    .await
}

fn create_db_pool() -> DbPool {
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    r2d2::Pool::builder()
        .max_size(10)
        .build(ConnectionManager::<MysqlConnection>::new(database_url))
        .expect("failed to create db connection pool")
}
