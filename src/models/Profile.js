import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export default (sequelize) => {
  const attributes = {
    user_id: Sequelize.INTEGER,
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
