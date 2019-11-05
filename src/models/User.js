import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  login: {
    allowNull: true,
    unique: true,
    type: Sequelize.STRING
  },
  email: {
    allowNull: false,
    unique: true,
    type: Sequelize.STRING
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING
  },
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
  },
};

export default (sequelize) => {


  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  };

  const User = sequelize.define("users", attributes, options);

  User.associate = (models) => {
    models.User.hasOne(models.Settings, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id'
    });

    models.User.hasOne(models.Profile, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id'
    });

    models.User.hasOne(models.SessionHistory, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id'
    })

    models.Transaction.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id'
    });
  };

  return User;
}
