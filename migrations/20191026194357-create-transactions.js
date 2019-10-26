'use strict';
import { attributes } from '../src/models/Transaction';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transactions", attributes)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transactions');
  }
};
