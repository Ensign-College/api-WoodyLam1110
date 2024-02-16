

// Function to add a new order item with orderId and timestamp as key
async function addOrderItemId({redisClient, orderItem}) {
    const timestamp = Date.now();
    const uniqueKey = `order:${orderItem.orderId}:${timestamp}`;
    await redisClient.json.set(uniqueKey, '$', orderItem);
    return uniqueKey; // Return the key for confirmation
}

module.exports = { addOrderItemId };