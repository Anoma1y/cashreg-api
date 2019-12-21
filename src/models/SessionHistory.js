import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";
import StructuredDataService from '../services/structuredData';

export const attributes = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  user_id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    references: {
      model: "users",
      key: "id"
    }
  },
  user_ip: {
    allowNull: false,
    type: Sequelize.STRING(50)
  },
  user_agent: Sequelize.STRING(150),
  created_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return dateToUnix(this.getDataValue('created_at'))
    }
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return dateToUnix(this.getDataValue('updated_at'))
    }
  }
};

export default (sequelize) => {
  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  };

  const SessionHistory = sequelize.define("session_histories", attributes, options);

  SessionHistory.associate = (models) => {
    models.SessionHistory.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id'
    })
  };

  StructuredDataService.withPagination(SessionHistory);

  return SessionHistory;
}
