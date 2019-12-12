import { Op } from 'sequelize';
import { removeEmpty } from './index';

export const getMultipleQueryValues = val => {
	if (!val) return [];

	return val.replace(/\s/g, '').split(',').filter(Boolean)
};

export const getMultipleOrder = (by_key, by_direct) => by_key.map((key, i) => ([
	key,
	by_direct[i] || 'desc',
]));

export const getWhere = (query, opt = {}) => {
	const {
		search = [], // поиск по строке object[]: @key - столбец, @queryKey - query ключ
		queryList = [], // query string[], которые будут добавлены в условие
		maybeMultipleQuery = [], // query string[], которые могут иметь массив значений (через запятую)
		valFromTo = [], // поиск от-до, object[]: @key - столбец, @from, @to, @factor - умножение на число
	} = opt;

	const initWhere = {};

	for (let i = 0; i <= queryList.length; i++) {
		const key = queryList[i];

		initWhere[key] = query[key];
	}

	const where = removeEmpty(initWhere);

	if (maybeMultipleQuery.length !== 0) {
		maybeMultipleQuery.forEach(query => {
			if (where[query] && where[query].length > 1) {
				where[query] = {
					[Op.in]: getMultipleQueryValues(where[query]),
				}
			}
		});
	}

	if (search.length !== 0) {
		search.forEach(searchItem => {
			where[searchItem.key] = {
				[Op.iLike]: `%${query[searchItem.queryKey].toLowerCase()}%`,
			}
		})
	}

	if (valFromTo.length !== 0) {
		valFromTo.forEach(FromTo => {
			if (query[FromTo.from] && query[FromTo.to]) {
				where[FromTo.key] = {
					[Op.gte]: query[FromTo.from] * (FromTo.factor || 1),
					[Op.lte]: query[FromTo.to] * (FromTo.factor || 1),
				};
			} else if (query[FromTo.from] && !query[FromTo.to]) {
				where[FromTo.key] = {
					[Op.gte]: query[FromTo.from] * (FromTo.factor || 1),
				}
			} else if (!query[FromTo.from] && query[FromTo.to]) {
				where[FromTo.key] = {
					[Op.lte]: query[FromTo.to] * (FromTo.factor || 1),
				}
			}
		});
	}

	return where;
};
