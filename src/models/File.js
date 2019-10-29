import Sequelize from 'sequelize';
import { dateToUnix } from '../helpers/index';

export const attributes = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  original_name: {
    allowNull: false,
    type: Sequelize.STRING
  },
  extension: {
    allowNull: false,
    type: Sequelize.STRING
  },
  size: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  original_uri: {
    allowNull: true,
    defaultValue: null,
    type: Sequelize.STRING
  },
  preview_uri: {
    allowNull: true,
    defaultValue: null,
    type: Sequelize.STRING
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
  },
};

export default (sequelize) => {
  const options = {
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  };

  const File = sequelize.define("files", attributes, options);

  File.associate = (models) => {
    models.File.belongsToMany(models.Transaction, {
      through: models.TransactionFiles,
      foreignKey: 'file_id',
      as: 'transactions',
    });
    // models.File.belongsToMany(models.Transaction, {
    //   through: models.TransactionFiles,
    //   foreignKey: 'transaction_id',
    // });
    // models.File.belongsToMany(models.TransactionFiles, {
    //   through: models.TransactionFiles,
    // });
  };

  return File;
}
