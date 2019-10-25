import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export default (sequelize) => {
  const attributes = {
    login: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
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
  };

  return User;
}
