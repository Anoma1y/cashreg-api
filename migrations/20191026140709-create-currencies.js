"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("currencies", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      charCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      numCode: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      nominal: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      value: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("currencies");
  }
};
