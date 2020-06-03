table! {
    clients (id) {
        id -> Int4,
        name -> Varchar,
    }
}

table! {
    members (id) {
        id -> Int4,
        role_id -> Int4,
        user_id -> Int4,
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

table! {
    users (id) {
        id -> Int4,
        client_id -> Int4,
        name -> Varchar,
        email -> Varchar,
    }
}

joinable!(members -> roles (role_id));
joinable!(members -> users (user_id));
joinable!(roles -> clients (client_id));
joinable!(users -> clients (client_id));

allow_tables_to_appear_in_same_query!(
    clients,
    members,
    roles,
    users,
);
