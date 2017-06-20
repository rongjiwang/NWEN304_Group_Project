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
    'image VARCHAR(255) NOT NULL, ' +
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

//----------Add Admins------------
query = client.query('insert into account(' +
    'userid,username,password,emailaddress,admin) ' +
    'values (default,$1,$2,$3,$4)'
    ,['rong','12345','rong@ttt.com',true]);

query = client.query('insert into account(' +
    'userid,username,password,emailaddress,admin) ' +
    'values (default,$1,$2,$3,$4)'
    ,['raff','12345','raff@ttt.com',true]);

query = client.query('insert into account(' +
    'userid,username,password,emailaddress,admin) ' +
    'values (default,$1,$2,$3,$4)'
    ,['ad','12345','ad@ttt.com',true]);

//----------Add items------------
query = client.query('insert into item(' +
    'itemID,image,name,description,price,quantity) ' +
    'values (default,$1,$2,$3,$4,$5)'
    ,['https://images-na.ssl-images-amazon.com/images/I/91zlVmXTLOL._SL1500_.jpg',
        'Captain America','As Steve Rogers struggles to embrace his role in the modern world, he teams up with a fellow Avenger and S.H.I.E.L.D agent, Black Widow.'
        ,20,10]);

query = client.query('insert into item(' +
    'itemID,image,name,description,price,quantity) ' +
    'values (default,$1,$2,$3,$4,$5)'
    ,['https://images-na.ssl-images-amazon.com/images/I/91UusfCtQaL._SY445_.jpg',
        'Arrival (2016)','When twelve mysterious spacecraft appear around the world, linguistics professor Louise Banks is tasked with interpreting the language of.'
        ,25,11]);

query = client.query('insert into item(' +
    'itemID,image,name,description,price,quantity) ' +
    'values (default,$1,$2,$3,$4,$5)'
    ,['https://images-na.ssl-images-amazon.com/images/I/616wPom8RSL._SX342_.jpg',
        'Moana (2016)','In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches an impetuous Chieftain\'s daughter\'s island, she answers the Ocean\'s .'
        ,22,12]);

query = client.query('insert into item(' +
    'itemID,image,name,description,price,quantity) ' +
    'values (default,$1,$2,$3,$4,$5)'
    ,['https://images-na.ssl-images-amazon.com/images/I/71H8PNeyCaL._SY550_.jpg',
        'The Mummy (2017)','An ancient princess is awakened from her crypt beneath the desert, bringing with her malevolence grown over millennia, and terrors that defy human '
        ,35,12]);

query = client.query('insert into item(' +
    'itemID,image,name,description,price,quantity) ' +
    'values (default,$1,$2,$3,$4,$5)'
    ,['./images/Baywatch-movie.jpg',
        'Baywatch (2017)','Devoted lifeguard Mitch Buchannon butts heads with a brash new recruit, as they uncover a criminal plot that threatens the future of the bay.'
        ,32,10]);

query = client.query('insert into item(' +
    'itemID,image,name,description,price,quantity) ' +
    'values (default,$1,$2,$3,$4,$5)'
    ,['https://images-na.ssl-images-amazon.com/images/I/61W9C1BGpBL.jpg',
        'Game of Thrones','During the War of the Five Kings, House Forrester finds themselves embroiled in a web of deceit and corruption.'
        ,99,11]);


//----------Close database connection--------
query.on('end', () => {client.end(); });