import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export default (sequelize) => {
  const attributes = {
    user_id: Sequelize.INTEGER,
    user_ip: Sequelize.STRING(50),
    user_agent: Sequelize.STRING(150),
    created_at: {
      type: Sequelize.DATE,
      get() {
        return dateToUnix(this.getDataValue('created_at'))
      }
    },
    updated_at: {
      type: Sequelize.DATE,
      get() {
        return dateToUnix(this.getDataValue('updated_at'))
      }
    }
  };

  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    freezeTableName: true,
  };

  const SessionHistory = sequelize.define("session_history", attributes, options);

  SessionHistory.associate = (models) => {
    models.SessionHistory.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id'
    })
  };

  return SessionHistory;
}
