"use strict";
import { attributes } from '../src/models/Currency';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("currencies", attributes);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("currencies");
  }
};
