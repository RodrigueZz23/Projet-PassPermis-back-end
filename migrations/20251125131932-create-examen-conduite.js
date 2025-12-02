'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('examen_conduite', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      piece_id: Sequelize.STRING,
      nom: Sequelize.STRING,
      prenom: Sequelize.STRING,
      centre: Sequelize.STRING,
      categorie: Sequelize.STRING,
      note: Sequelize.INTEGER,
      resultat: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('examen_conduite');
  }
};
