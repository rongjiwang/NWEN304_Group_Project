/**
 * Created by rongjiwang on 28/05/17.
 */
var pg = require('pg').native
    , connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/rongjiwang"
    , client
    , query;

client = new pg.Client(connectionString);
client.connect();

query = client.query('CREATE TABLE Account(userId serial primary key, ' +
    'username varchar(255), password varchar(255), emailaddress varchar(255), admin boolean);');

query = client.query('CREATE TABLE ITEM(itemID SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, ' +
    'description VARCHAR(255), price NUMERIC NOT NULL, quantity INTEGER NOT NULL)');

query = client.query('CREATE TABLE CART(cartID INTEGER, itemID INTEGER, quantity INTEGER, ' +
    'PRIMARY KEY (cartID), FOREIGN KEY (cartID) REFERENCES Account (userId))');

query.on('end', () => {client.end(); });