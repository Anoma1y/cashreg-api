import Sequelize from 'sequelize';
import { dateToUnix } from '../helpers/index';

export default (sequelize) => {
  const attributes = {
    original_name: Sequelize.STRING,
    extension: Sequelize.STRING,
    size: Sequelize.INTEGER,
    original_uri: Sequelize.STRING,
    preview_uri: Sequelize.STRING,
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
    createdAt: 'created_at'
  };

  return sequelize.define("files", attributes, options);
}
