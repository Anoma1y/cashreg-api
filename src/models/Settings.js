import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
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
  show_penny: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  }
};

export default (sequelize) => {
  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  };

  const Settings = sequelize.define("settings", attributes, options);

  Settings.associate = (models) => {
    models.Settings.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id'
    })
  };

  return Settings;
}
