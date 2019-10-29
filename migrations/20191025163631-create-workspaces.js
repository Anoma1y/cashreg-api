'use strict';
import { attributes } from '../src/models/Workspace';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("workspaces", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        unique: false,
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      is_personal: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('workspaces');
  }
};
