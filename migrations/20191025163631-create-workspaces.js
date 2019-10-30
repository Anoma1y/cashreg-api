'use strict';
import { attributes } from '../src/models/Workspace';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("workspaces", attributes)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('workspaces');
  }
};
