/**
 * Created by rongjiwang on 28/05/17.
 */
var pg = require('pg').native
    , connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/rongjiwang"
    , client
    , query;

client = new pg.Client(connectionString);
client.connect();

query = client.query('' +
    'DROP TABLE IF EXISTS CART;' +
    'DROP TABLE IF EXISTS ITEM;' +
    'DROP TABLE IF EXISTS ACCOUNT;'
    );

query = client.query('' +
    'CREATE TABLE IF NOT EXISTS Account(' +
    'userId serial primary key, ' +
    'username varchar(255) NOT NULL, ' +
    'password varchar(255) NOT NULL, ' +
    'emailaddress varchar(255) NOT NULL, ' +
    'admin boolean NOT NULL);'
);

query = client.query('' +
    'CREATE TABLE IF NOT EXISTS ITEM(' +
    'itemID SERIAL PRIMARY KEY, ' +
    'name VARCHAR(255) NOT NULL, ' +
    'description VARCHAR(255), ' +
    'price NUMERIC NOT NULL, ' +
    'quantity INTEGER NOT NULL)');

query = client.query('' +
    'CREATE TABLE IF NOT EXISTS CART(' +
    'cartID INTEGER,' +
    'itemID INTEGER,' +
    'quantity INTEGER, ' +
    'PRIMARY KEY (cartID), ' +
    'FOREIGN KEY (cartID) REFERENCES Account (userId))');

query = client.query('CREATE OR REPLACE FUNCTION trigger_id() ' +
    'RETURNS TRIGGER AS $$ ' +
    'BEGIN ' +
    'INSERT INTO CART(cartid) VALUES(NEW.userid);' +
    'RETURN NULL;' +
    'END;' +
    '$$ LANGUAGE '+'plpgsql'+';');

query = client.query('' +
    'CREATE TRIGGER trigger_id_action ' +
    'AFTER INSERT ON ACCOUNT ' +
    'FOR EACH ROW ' +
    'EXECUTE PROCEDURE trigger_id();');

//----------Testing Query------------
query = client.query('insert into account(' +
    'userid,username,password,emailaddress,admin) ' +
    'values (default,$1,$2,$3,$4)'
    ,['Rongji','12345','rong@ttt.com',true]);

//----------Close database connection--------
query.on('end', () => {client.end(); });