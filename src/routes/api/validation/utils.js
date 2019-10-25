import Validator from 'validator';

export const editCustomValidate = value => value === null || Validator.isLength(value, { min: 1, max: 255 });
