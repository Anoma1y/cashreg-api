import Config from './';
import Sequelize from 'sequelize';
import FileModel from '../models/File';
import UserModel from '../models/User';
import ActionCodesModel from '../models/ActionCodes';
import CategoryModel from '../models/Category';
import ContragentModel from '../models/Contragent';
import SessionHistoryModel from '../models/SessionHistory';
import ProfileModel from '../models/Profile';
import SettingsModel from '../models/Settings';
import WorkspaceModel from '../models/Workspace';
import WorkspaceUsersModel from '../models/WorkspaceUsers';
import TransactionModel from '../models/Transaction';
import TransactionFilesModel from '../models/TransactionFiles';
import CurrencyModel from '../models/Currency';

const sequelizeOptions = {
  host: Config.db_host,
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  logging: true,

  define: {
    underscored: false,
    freezeTableName: false,
    timestamps: true,
  }

};

export const sequelize = new Sequelize(
  Config.db_name,
  Config.db_username,
  Config.db_password,
  sequelizeOptions
);

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

const db = {
  sequelize,
  Sequelize,
  SessionHistory: SessionHistoryModel(sequelize),
  User: UserModel(sequelize),
  ActionCodes: ActionCodesModel(sequelize),
  File: FileModel(sequelize),
  Profile: ProfileModel(sequelize),
  Settings: SettingsModel(sequelize),
  Category: CategoryModel(sequelize),
  Contragent: ContragentModel(sequelize),
  Workspace: WorkspaceModel(sequelize),
  WorkspaceUsers: WorkspaceUsersModel(sequelize),
  Transaction: TransactionModel(sequelize),
  TransactionFiles: TransactionFilesModel(sequelize),
  Currency: CurrencyModel(sequelize),
};

Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
