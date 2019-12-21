"use strict";
import { attributes } from '../src/models/SessionHistory';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("session_histories", attributes);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("session_histories");
  }
};
