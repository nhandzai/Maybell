// ../redis/redis.js
const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'PiFlvsec7nseEP2O85VVG9RHiMJOUbEe',
    socket: {
        host: 'redis-10162.crce178.ap-east-1-1.ec2.redns.redis-cloud.com',
        port: 10162,
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
