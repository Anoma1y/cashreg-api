import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  workspace_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "workspaces",
      key: "id"
    },
  },
  parent_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "categories",
      key: "id",
    },
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
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
  deleted_at: {
    allowNull: true,
    type: Sequelize.DATE,
    defaultValue: null,
    get() {
      return dateToUnix(this.getDataValue('deleted_at'))
    },
  }
};

export default (sequelize) => {
  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  };

  const Category = sequelize.define("categories", attributes, options);

  Category.associate = (models) => {
    // models.Category.belongsTo(models.Workspace, {
    //   onDelete: 'CASCADE',
    //   foreignKey: 'workspace_id'
    // });

    models.Category.belongsTo(models.Workspace, {
      onDelete: 'CASCADE',
      foreignKey: 'workspace_id',
    });

    models.Transaction.belongsTo(models.Category, {
      onDelete: 'CASCADE',
      foreignKey: 'category_id',
    });
  };

  return Category;
}
