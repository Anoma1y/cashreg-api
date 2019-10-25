import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export default (sequelize) => {
  const attributes = {
    workspace_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
