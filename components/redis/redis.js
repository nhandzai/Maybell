// ../redis/redis.js
const { createClient } = require('redis');

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

client.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis successfully');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
})();

module.exports = client;
