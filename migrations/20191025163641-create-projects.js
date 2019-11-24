'use strict';
import { attributes } from '../src/models/Project';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("projects", attributes)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('projects');
  }
};
