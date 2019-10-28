'use strict';
import { attributes } from '../src/models/WorkspaceUsers';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("workspace_users", attributes)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('workspace_users');
  }
};
