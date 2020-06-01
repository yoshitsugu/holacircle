table! {
    clients (id) {
        id -> Int4,
        name -> Varchar,
    }
}

table! {
    roles (id) {
        id -> Int4,
        client_id -> Int4,
        role_id -> Nullable<Int4>,
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
