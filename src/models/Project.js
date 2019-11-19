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
    onDelete: "CASCADE",
    allowNull: false,
    references: {
      model: "workspaces",
      key: "id"
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
  finished_at: {
    allowNull: true,
    type: Sequelize.DATE,
    defaultValue: null,
    get() {
      return dateToUnix(this.getDataValue('finished_at'))
    },
  }
};

export default (sequelize) => {
  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    finishedAt: 'finished_at',
  };

  const Project = sequelize.define("projects", attributes, options);

  Project.associate = (models) => {
    // models.Project.belongsTo(models.Workspace, {
    //   onDelete: 'CASCADE',
    //   foreignKey: 'workspace_id'
    // });

    // models.Transaction.belongsTo(models.Project, {
    //   onDelete: 'CASCADE',
    //   foreignKey: 'category_id',
    // });
  };

  return Project;
}
