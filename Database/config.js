var pgp = require("pg-promise")();

var cn = process.env.DATABASE_URL || "postgres://alcancal:helloworld@depot:5432/alcancal_jdbc";

//pgp.pg.defaults.ssl = true; // cloud connection

var db = pgp(cn);

module.exports = db;
