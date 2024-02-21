

// Function to add a new order item with orderId and timestamp as key
async function addOrderItemId({redisClient, orderItem}) {
    const timestamp = Date.now();
    const uniqueKey = `orderItem:${orderItem.orderId}-${timestamp}`;
    await redisClient.json.set(uniqueKey, '$', orderItem);
    return uniqueKey; // Return the key for confirmation
}


    async function searchOrderItem({ redisClient, searchCriteria }) {
        let results = [];
    
        if (searchCriteria.orderItemId) {
            // Assuming order items are stored with keys like "orderItem:{orderItemId}"
            const orderItemKey = `orderItem:${searchCriteria.orderItemId}`;
            const orderItem = await redisClient.json.get(orderItemKey);
            if (orderItem) {
                results.push(JSON.parse(orderItem));
            }
        }
    
    
        return results;
    }


module.exports = { addOrderItemId,searchOrderItem };