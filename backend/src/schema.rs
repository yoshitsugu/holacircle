table! {
    clients (id) {
        id -> Integer,
        name -> Varchar,
    }
}

table! {
    roles (id) {
        id -> Integer,
        client_id -> Integer,
        name -> Varchar,
        is_circle -> Bool,
        purpose -> Text,
        domains -> Text,
        accountabilities -> Text,
    }
}

joinable!(roles -> clients (client_id));

allow_tables_to_appear_in_same_query!(
    clients,
    roles,
);
