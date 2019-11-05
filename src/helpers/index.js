import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';

export const generateCode = () => {
  const str = uuid() + uuid();

  return str.replace(/-/g, '');
};

export const generateKey = () => Math.floor(100000 + Math.random() * 900000);

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

export const generateFileName = (originalname, separate) => {
  const hash = uuid().replace(/-/g, '').slice(0, 25);
  const currentTime = new Date();
  const month = (currentTime.getUTCMonth() + 1).toString();
  const day = currentTime.getUTCDate().toString();
  const year = currentTime.getUTCFullYear().toString().substr(-2);
  const groupName = `${year}${month}${day}`;
  const path = `cashreg/uploads/transactions/${groupName}`;

  if (separate) {
    return `${path}/${separate}/${hash}-${originalname}`
  }

  return `${path}/original/${hash}-${originalname}`;
};

export const getFileNameExt = originalname => {
  const file = originalname.split('/').pop();

  return file.substr(file.lastIndexOf('.') + 1, file.length);
};

export const getCurrentTimestamp = (toMs = false) => (+new Date()) * (toMs ? 1000 : 1);

export const addTimestamp = (s, toMs = false) => (Math.round(new Date().getTime() / 1000) + s) * (toMs ? 1000 : 1);

export const dateToUnix = (date, toMs = true) => {
  if (date === null) return null;

  const toUnix = +date;

  return Math.floor(toUnix / (toMs ? 1000 : 1));
};

export const removeEmpty = (obj) => {
  const modObj = { ...obj };

  Object.keys(modObj).forEach((key) => (modObj[key] === undefined || modObj[key] === '' || modObj[key] === null ? delete modObj[key] : modObj[key]));

  return modObj;
};
