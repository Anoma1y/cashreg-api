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
  type: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  code: {
    allowNull: false,
    type: Sequelize.STRING(200)
  },
  expires_at: {
    type: Sequelize.DATE,
    get() {
      return dateToUnix(this.getDataValue('expires_at'))
    }
  },
  claimed_at: {
    allowNull: true,
    type: Sequelize.DATE,
    defaultValue: null,
    get() {
      return dateToUnix(this.getDataValue('claimed_at'))
    }
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
  }
};

export default (sequelize) => {
  const options = {
    expiresAt: 'expires_at',
    claimedAt: 'claimed_at',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  };

  const ActionCodes = sequelize.define("action_codes", attributes, options);

  ActionCodes.associate = (models) => {
    models.ActionCodes.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id'
    })
  };

  return ActionCodes;
}
