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

  const Category = sequelize.define("categories", attributes, options);

  Category.associate = (models) => {
    models.Category.belongsTo(models.Workspace, {
      onDelete: 'CASCADE',
      foreignKey: 'workspace_id'
    });
  };

  return Category;
}
