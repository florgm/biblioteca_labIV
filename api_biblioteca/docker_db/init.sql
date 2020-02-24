-- CREATE DATABASE IF NOT EXISTS bd_library;
USE db_library;

-- drop table bd_library.books;
-- drop table bd_library.users;
-- drop table bd_library.loans;

create table db_library.books (
    bookID         varchar(9)      not null,
    title          varchar(255)    not null,
    author         varchar(255)    not null,
    quantity       smallint        not null,
    primary key (bookID),
    check (quantity > 0)
);

create table db_library.users (
    userID    varchar(9)      not null,
    name      varchar(40)     not null,
    user      varchar(20)     not null,
    pass      char(60)        not null,
    role      char(1)         not null      default 'L',
    primary key (userID)
);

create table db_library.loans (
    loanID             varchar(9)      not null,
    userID             varchar(9)      not null,
    bookID             varchar(9)      not null,
    expiration_date    bigint         not null,
    primary key (loanID),
    foreign key (bookID) references db_library.books(bookID),
    foreign key (userID) references db_library.users(userID)
);