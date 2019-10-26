"use strict";
import { attributes } from '../src/models/File';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("files", attributes);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("files");
  }
};
