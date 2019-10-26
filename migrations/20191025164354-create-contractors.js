'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("contractors", {
      id: {
        allowNull: false,
        primaryKey: true,
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
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      contrAgentInn: {
        allowNull: false,
        type: Sequelize.STRING(20),
        defaultValue: "",
      },
      contrAgentKpp: {
        allowNull: false,
        type: Sequelize.STRING(50),
        defaultValue: "",
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
    return queryInterface.dropTable('contractors');
  }
};
