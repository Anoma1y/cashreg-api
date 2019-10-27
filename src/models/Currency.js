import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
  id: {
    primaryKey: true,
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  charCode: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
  numCode: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  nominal: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  value: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    get() {
      return dateToUnix(this.getDataValue('created_at'))
    }
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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

  const Currency = sequelize.define("currencies", attributes, options);

  Currency.associate = (models) => {
    models.Transaction.belongsTo(models.Currency, {
      foreignKey: 'currency_id',
    });
  };

  return Currency;
}
