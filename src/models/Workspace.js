import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export default (sequelize) => {
	const attributes = {
		name: Sequelize.STRING,
		is_personal: Sequelize.BOOLEAN,
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
		},
		deleted_at: {
			type: Sequelize.DATE,
			get() {
				return dateToUnix(this.getDataValue('deleted_at'))
			}
		}
	};

	const options = {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		deletedAt: 'deleted_at',
	};

	const Workspace = sequelize.define("workspaces", attributes, options);

	Workspace.associate = (models) => {
		models.Workspace.hasOne(models.Category, {
			onDelete: 'CASCADE',
			foreignKey: 'workspace_id'
		});
	};

	return Workspace;
}
