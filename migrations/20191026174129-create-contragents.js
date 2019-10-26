'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("contragents", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "workspaces",
          key: "id"
        }
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      longTitle: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      payment_info: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      contrAgentInn: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      contrAgentKpp: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('contragents');
  }
};
