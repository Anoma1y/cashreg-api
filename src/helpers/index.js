import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';

export const generateCode = () => {
  const str = uuid() + uuid();

  return str.replace(/-/g, '');
};

export const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) reject(saltErr);
      else
        bcrypt.hash(password, salt, (hashErr, hash) => {
          if (hashErr) reject(hashErr);
          else resolve(hash);
        });
    });
  });

export const verifyPassword = (password, userPassword) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, userPassword, (err, result) => {
      if (err) reject(err);
      else resolve(Boolean(result));
    });
  });

export const uploadFile = (file, uploadPath) =>
  new Promise((resolve, reject) => {
    file.mv(uploadPath, (err) => {
      if (err) reject(err);
      resolve();
    });
  });

export const generateFileName = () => {
  const str = uuid();

  return str.replace(/-/g, '');
};

export const getFileNameExt = (str) => {
  const file = str.split('/').pop();

  return file.substr(file.lastIndexOf('.') + 1, file.length);
};

export const getCurrentTimestamp = (toMs = false) => (+new Date()) * (toMs ? 1000 : 1);

export const addTimestamp = (s, toMs = false) => (Math.round(new Date().getTime() / 1000) + s) * (toMs ? 1000 : 1);

export const dateToUnix = (date, toMs = true) => {
  const toUnix = +date;

  return Math.floor(toUnix / (toMs ? 1000 : 1));
};
