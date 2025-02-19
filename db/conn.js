const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ossimples", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

const conn = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados realizada com sucesso.");
  } catch (err) {
    console.log("Erro ao tentar conectar com o banco de dados. ", err);
  }
};
conn();

module.exports = sequelize;
