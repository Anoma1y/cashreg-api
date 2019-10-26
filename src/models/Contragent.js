import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export default (sequelize) => {
  const attributes = {
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
      type: Sequelize.DATE,
      get() {
        return dateToUnix(this.getDataValue('created_at'))
      },
    },
    updated_at: {
      type: Sequelize.DATE,
      get() {
        return dateToUnix(this.getDataValue('updated_at'))
      },
    },
    deleted_at: {
      type: Sequelize.DATE,
      get() {
        return dateToUnix(this.getDataValue('deleted_at'))
      },
    }
  };

  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  };

  const Contragent = sequelize.define("contragents", attributes, options);

  Contragent.associate = (models) => {
    models.Contragent.belongsTo(models.Workspace, {
      onDelete: 'CASCADE',
      foreignKey: 'workspace_id'
    });
  };

  return Contragent;
}
