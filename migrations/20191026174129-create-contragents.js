'use strict';
import { attributes } from '../src/models/Contragent';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("contragents", attributes)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('contragents');
  }
};
