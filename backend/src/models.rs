use super::schema::clients;
use super::schema::roles;

#[derive(Queryable)]
pub struct Client {
    pub id: i32,
    pub name: String,
}

#[derive(Insertable)]
#[table_name = "clients"]
pub struct NewClient {
    pub name: String,
}

#[derive(Queryable, Associations, Debug, Clone, PartialEq)]
pub struct Role {
    pub id: i32,
    pub client_id: i32,
    pub role_id: Option<i32>,
    pub name: String,
    pub is_circle: bool,
    pub purpose: String,
    pub domains: String,
    pub accountabilities: String,
}

#[derive(Insertable)]
#[table_name = "roles"]
pub struct NewRole {
    pub client_id: i32,
    pub name: String,
    pub is_circle: bool,
    pub purpose: String,
    pub domains: String,
    pub accountabilities: String,
}
