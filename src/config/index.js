import dotenv from 'dotenv';
dotenv.config();

export default {
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_host: process.env.DB_HOST,

  port: process.env.PORT || 3000,

  jwt_lifetime: process.env.JWT_LIFETIME || 3000,
  jwt_refresh_lifetime: process.env.JWT_REFRESH_LIFETIME || 300000,

  DIGITAL_OCEAN_SPACES_ACCESS_KEY: process.env.DIGITAL_OCEAN_SPACES_ACCESS_KEY,
  DIGITAL_OCEAN_SPACES_SECRET_KEY: process.env.DIGITAL_OCEAN_SPACES_SECRET_KEY,
  DIGITAL_OCEAN_SPACES_BUCKET_NAME: process.env.DIGITAL_OCEAN_SPACES_BUCKET_NAME,
  DIGITAL_OCEAN_SPACES_ENDPOINT: process.env.DIGITAL_OCEAN_SPACES_ENDPOINT,

  debug: true, // todo add check development/production env
};
