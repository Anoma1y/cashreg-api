'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        }
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
      // contragent_id: {
      //   type: Sequelize.INTEGER,
      //   onDelete: "CASCADE",
      //   allowNull: true,
      //   references: {
      //     model: "contragents",
      //     key: "id"
      //   }
      // },
      category_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "categories",
          key: "id"
        }
      },
      // currency_id: {
      //   type: Sequelize.INTEGER,
      //   onDelete: "CASCADE",
      //   allowNull: false,
      //   references: {
      //     model: "currencies",
      //     key: "id"
      //   }
      // },
      sum: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      type: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      comment: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      registered_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transactions');
  }
};
