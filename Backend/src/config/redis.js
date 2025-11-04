const { createClient } = require('redis');

function createRedisClient(redisUrl) {
  const client = createClient({ url: redisUrl });
  client.on('error', (err) => console.error('Redis Client Error', err));
  client.connect().then(() => console.log('Redis connected')).catch(console.error);
  return client;
}

module.exports = createRedisClient;
