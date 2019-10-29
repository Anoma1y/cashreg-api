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
  avatar_id: {
    type: Sequelize.INTEGER,
    defaultValue: null,
    onDelete: "CASCADE",
    allowNull: true,
    references: {
      model: "files",
      key: "id"
    }
  },
  first_name: {
    type: Sequelize.STRING(150),
    allowNull: true,
  },
  last_name: {
    type: Sequelize.STRING(150),
    allowNull: true,
  },
  phone: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },
  location: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  is_email_verified: {
    allowNull: false,
    defaultValue: false,
    type: Sequelize.BOOLEAN
  },
  is_blocked: {
    allowNull: false,
    defaultValue: false,
    type: Sequelize.BOOLEAN
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
    },
  },
};

export default (sequelize) => {
  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  };

  const Profile = sequelize.define("profiles", attributes, options);

  Profile.associate = (models) => {
    models.Profile.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id'
    });

    models.Profile.hasOne(models.File, {
      onDelete: 'CASCADE',
      foreignKey: 'id'
    })
  };

  return Profile;
}
