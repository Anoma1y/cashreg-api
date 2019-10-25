import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on('error', (err) => {
  console.log('Error ' + err);
});

const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);
const setAsync = promisify(client.set).bind(client);
const keysAsync = promisify(client.keys).bind(client);
const incrAsync = promisify(client.incr).bind(client);
const hgetAsync = promisify(client.hget).bind(client);
const hgetAllAsync = promisify(client.hgetall).bind(client);
const hsetObjectAsync = promisify(client.hmset).bind(client);
const hsetAsync = promisify(client.hset).bind(client);
const hincrbyAsync = promisify(client.hincrby).bind(client);

export {
  getAsync as redisGetAsync,
  setAsync as redisSetAsync,
  keysAsync as redisKeysAsync,
  delAsync as redisDelAsync,
  incrAsync as redisIncrAsync,
  hgetAsync as redisHgetAsync,
  hsetObjectAsync as redisHSetObjectAsync,
  hsetAsync as redisHsetAsync,
  hgetAllAsync as redisHgetAllAsync,
  hincrbyAsync as redisHincrbyAsync
};

export default client;
