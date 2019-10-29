"use strict";
import { attributes } from '../src/models/Profile';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("profiles", attributes);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("profiles");
  }
};
