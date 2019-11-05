"use strict";
import { attributes } from '../src/models/User';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", attributes);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
