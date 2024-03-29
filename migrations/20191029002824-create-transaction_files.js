'use strict';
import { attributes } from '../src/models/TransactionFiles';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transaction_files", attributes)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transaction_files');
  }
};
