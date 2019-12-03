import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
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
  type: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  inn: {
    allowNull: true,
    type: Sequelize.STRING(20),
  },
  kpp: {
    allowNull: true,
    type: Sequelize.STRING(50),
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return dateToUnix(this.getDataValue('created_at'))
    },
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return dateToUnix(this.getDataValue('updated_at'))
    },
  },
  archived_at: {
    allowNull: true,
    type: Sequelize.DATE,
    defaultValue: null,
    get() {
      return dateToUnix(this.getDataValue('archived_at'))
    },
  },
};

export default (sequelize) => {
  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'archived_at',
  };

  const Contragent = sequelize.define("contragents", attributes, options);

  Contragent.associate = (models) => {
    models.Contragent.belongsTo(models.Workspace, {
      onDelete: 'CASCADE',
      foreignKey: 'workspace_id'
    });

    models.Transaction.belongsTo(models.Contragent, {
      onDelete: 'CASCADE',
      foreignKey: 'contragent_id'
    });
  };

  return Contragent;
}
