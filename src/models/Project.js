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
  contragent_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "contragents",
      key: "id"
    },
  },
  title: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  start_date: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: null,
    get() {
      return dateToUnix(this.getDataValue('start_date'))
    },
  },
  end_date: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: null,
    get() {
      return dateToUnix(this.getDataValue('end_date'))
    },
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
    finishedAt: 'finished_at',
    archivedAt: 'archived_at',
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
