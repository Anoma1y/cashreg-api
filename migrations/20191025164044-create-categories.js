'use strict';
import { attributes } from '../src/models/Category';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("categories", attributes)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categories');
  }
};
