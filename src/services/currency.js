import DB from '../config/db';

class Currency {
  getSingle = async (id, options = {}) => DB.Currency.findOne({
    where: {
      id
    },
    attributes: {
      exclude: [
        'created_at',
        'updated_at',
      ],
    },
  }, options);

  getList = async (options = {}) => DB.Currency.findAll({
    where: {
      enabled: true,
    },
    attributes: {
      exclude: [
        'created_at',
        'updated_at',
        'value',
        'nominal',
        'enabled',
      ],
    },
    json: true,
    ...options,
  });
}

export default new Currency();
