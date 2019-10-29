'use strict';
import { attributes } from '../src/models/ActionCodes';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("action_codes", attributes)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('action_codes');
  }
};
