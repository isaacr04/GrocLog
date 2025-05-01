const { Item } = require('./db');

console.log('Accessing itemlog.js...');

// Add new item
async function addItem(req, res) {
    const { userId, item, price, quantity, purchaseDate, location, brand, type } = req.body;
    if (!userId || !item || !price || !purchaseDate) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    const newItem = new Item({
        userId: userId,
        item,
        quantity,
        price,
        purchaseDate: purchaseDate,
        location: location || null,
        brand: brand || null,
        type: type || null
    });

    try {
        const savedItem = await newItem.save();
        res.json({ message: 'Item added successfully', id: savedItem._id });
    } catch (err) {
        console.error('Error inserting item:', err);
        res.status(500).json({ error: 'Database error' });
    }
}

// Search items
async function searchItems(req, res) {
    const { userId, item, price, quantity, purchaseDate, start_date, end_date, location, brand, type } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    let filter = { userId: userId };

    if (item) filter.item = { $regex: item, $options: 'i' };
    if (price) filter.price = price;
    if (quantity) filter.quantity = quantity;
    if (purchaseDate) {
        filter.purchaseDate = purchaseDate;
    } else if (start_date && end_date) {
        filter.purchaseDate = { $gte: start_date, $lte: end_date };
    }
    if (location) filter.location = location;
    if (brand) filter.brand = brand;
    if (type) filter.type = type;

    try {
        const items = await Item.find(filter);
        res.json(items);
    } catch (err) {
        console.error('Error searching items:', err);
        res.status(500).json({ error: 'Database error' });
    }
}

// Delete item
async function deleteItem(req, res) {
    const { userId, item, price, quantity, purchaseDate } = req.body;
    if (!userId || !item || !price || !quantity || !purchaseDate) {
        return res.status(400).json({ error: 'All fields are required for deletion' });
    }

    try {
        const result = await Item.deleteOne({
            userId,
            item,
            price,
            quantity,
            purchaseDate,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No matching item found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Database error' });
    }
}

// Edit item
async function editItem(req, res) {
    const {
        userId,
        item,
        price,
        quantity,
        purchaseDate,
        newItem,
        newPrice,
        newQuantity,
        newDate,
        newLocation,
        newBrand,
        newType
    } = req.body;

    if (!userId || !item || price == null || quantity == null || !purchaseDate || !newItem || newPrice == null || newQuantity == null || !newDate) {
        return res.status(400).json({ error: 'Required fields missing for editing' });
    }

    try {
        const result = await Item.updateOne(
            {
                userId: Number(userId),
                item: item,
                price: Number(price),
                quantity: Number(quantity),
                purchaseDate: purchaseDate,
            },
            {
                $set: {
                    item: newItem,
                    price: Number(newPrice),
                    quantity: Number(newQuantity),
                    purchaseDate: newDate,
                    location: newLocation || null,
                    brand: newBrand || null,
                    type: newType || null
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'No matching item found to update' });
        }

        res.json({ message: 'Item updated successfully' });
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ error: 'Database error' });
    }
}

// Analytics endpoint
async function getAnalytics(req, res) {
    const { userId, days } = req.body;

    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        // Get spending over time (group by day/week/month depending on time period)
        const spendingOverTime = await Item.aggregate([
            { $match: {
                    userId: userId,
                    purchaseDate: { $gte: startDate, $lte: endDate }
                }},
            { $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
                    total: { $sum: { $multiply: ["$price", "$quantity"] } }
                }},
            { $sort: { _id: 1 } }
        ]);

        // Get spending by location
        const spendingByLocation = await Item.aggregate([
            { $match: {
                    userId: userId,
                    purchaseDate: { $gte: startDate, $lte: endDate },
                    location: { $exists: true, $ne: null }
                }},
            { $group: {
                    _id: "$location",
                    total: { $sum: { $multiply: ["$price", "$quantity"] } }
                }}
        ]);

        // Get spending by brand
        const spendingByBrand = await Item.aggregate([
            { $match: {
                    userId: userId,
                    purchaseDate: { $gte: startDate, $lte: endDate },
                    brand: { $exists: true, $ne: null }
                }},
            { $group: {
                    _id: "$brand",
                    total: { $sum: { $multiply: ["$price", "$quantity"] } }
                }}
        ]);

        // Get spending by type
        const spendingByType = await Item.aggregate([
            { $match: {
                    userId: userId,
                    purchaseDate: { $gte: startDate, $lte: endDate },
                    type: { $exists: true, $ne: null }
                }},
            { $group: {
                    _id: "$type",
                    total: { $sum: { $multiply: ["$price", "$quantity"] } }
                }}
        ]);

        // Get unique items for price trends dropdown
        const items = await Item.distinct("item", { userId: userId });

        res.json({
            spendingOverTime: {
                labels: spendingOverTime.map(item => item._id),
                values: spendingOverTime.map(item => item.total)
            },
            spendingByLocation: {
                labels: spendingByLocation.map(item => item._id),
                values: spendingByLocation.map(item => item.total)
            },
            spendingByBrand: {
                labels: spendingByBrand.map(item => item._id),
                values: spendingByBrand.map(item => item.total)
            },
            spendingByType: {
                labels: spendingByType.map(item => item._id),
                values: spendingByType.map(item => item.total)
            },
            items
        });
    } catch (err) {
        console.error('Error getting analytics:', err);
        res.status(500).json({ error: 'Database error' });
    }
}

// Price trends endpoint
async function getPriceTrends(req, res) {
    const { userId, item } = req.body;

    try {
        const trends = await Item.aggregate([
            { $match: { userId: userId, item: item } },
            { $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$purchaseDate" } },
                    avgPrice: { $avg: "$price" }
                }},
            { $sort: { _id: 1 } }
        ]);

        res.json({
            labels: trends.map(t => t._id),
            values: trends.map(t => t.avgPrice)
        });
    } catch (err) {
        console.error('Error getting price trends:', err);
        res.status(500).json({ error: 'Database error' });
    }
}

module.exports = {
    addItem,
    searchItems,
    deleteItem,
    editItem,
    getAnalytics,
    getPriceTrends,
};
