"use strict";
import { attributes } from '../src/models/Settings';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("settings", attributes);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("settings");
  }
};
