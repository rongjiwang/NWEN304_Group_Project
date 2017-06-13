var pgp = require("pg-promise")();

var cn = process.env.DATABASE_URL || "postgres://localhost:5432/Raff";

//pgp.pg.defaults.ssl = true; // cloud connection

var db = pgp(cn);

module.exports = db;