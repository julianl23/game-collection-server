import Sequelize from "sequelize";

// TODO: Have actual un and password. Signature here is 'database', 'username', 'password'
const db = new Sequelize("gamecollection", "gamecollection", "gamecollection", {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

db
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

export default db;
