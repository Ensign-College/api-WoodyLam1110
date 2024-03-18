const Redis = require("redis");
const { addOrder } = require("../services/orderservice");

// Assuming Redis is accessible via a similar URI in your environment
const redisClient = Redis.createClient({
  url: "redis://your-redis-instance-endpoint:6379"
});

// Ensure Redis client connection is ready before handling requests
const connectRedisClient = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

exports.lambdaHandler = async (event, context) => {
    // Avoid closing the Redis connection on Lambda's cold start
    context.callbackWaitsForEmptyEventLoop = false;

    await connectRedisClient();

    try {
        const order = JSON.parse(event.body);
        await addOrder({ redisClient, order });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Order created successfully", order: order }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.message.includes("does not exist") ? 404 : 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
