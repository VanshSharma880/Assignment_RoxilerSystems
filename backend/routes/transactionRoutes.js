const express = require('express');
const axios = require('axios');
const ProductTransaction = require('../models/ProductTransaction');
const moment = require('moment');

const router = express.Router();

// Route to fetch data from third-party API and save it to the database
router.get('/init-db', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Clear existing data
        await ProductTransaction.deleteMany({});

        // Insert new data
        await ProductTransaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ message: 'Error initializing database', error: error.message });
    }
});

const getMonthNumber = (monthName) => {
    const months = moment.months();
    return months.indexOf(monthName) + 1; // Months are 1-based
};

// Route to list product transactions with search and pagination
router.get('/transactionsView', async (req, res) => {
    try {
        const { month, search = '' } = req.query;

        // Build query object
        let query = {};

        // Fetch data
        let transactions = await ProductTransaction.find(query);

        // Filter by month if provided
        if (month) {
            const monthNumber = getMonthNumber(month);
            if (!monthNumber) {
                return res.status(400).json({ message: 'Invalid month' });
            }

            const filteredTransactions = transactions.filter(transaction => {
                const transactionMonth = moment(transaction.dateOfSale).month() + 1; // moment.month() returns 0-based index
                return transactionMonth === monthNumber;
            });

            transactions = filteredTransactions;
        }

        // Search functionality
        if (search) {
            const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
            transactions = transactions.filter(transaction =>
                searchRegex.test(transaction.title) || searchRegex.test(transaction.description)
            );
        }

        // Send all transactions without pagination
        res.status(200).json({
            transactions,
            totalCount: transactions.length
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
});

// Route to get statistics for a selected month
router.get('/statistics', async (req, res) => {
    try {
        const month = req.query.month;

        // Convert month parameter to number
        let monthNumber = parseInt(month, 10);
        if (isNaN(monthNumber)) {
            monthNumber = getMonthNumber(month);
            if (!monthNumber) {
                return res.status(400).json({ error: 'Invalid month provided' });
            }
        }

        // Fetch data from the database
        const transactions = await ProductTransaction.find({});
        
        // Filter transactions by the selected month
        const filteredTransactions = transactions.filter(transaction => {
            const transactionMonth = moment(transaction.dateOfSale).month() + 1; // moment.month() returns 0-based index
            return transactionMonth === monthNumber;
        });

        // Calculate the total sale amount
        const totalSaleAmount = filteredTransactions.reduce((sum, transaction) => {
            return sum + (transaction.sold ? transaction.price : 0);
        }, 0);

        // Calculate the total number of sold items
        const totalSoldItems = filteredTransactions.filter(transaction => transaction.sold).length;

        // Calculate the total number of not sold items
        const totalNotSoldItems = filteredTransactions.filter(transaction => !transaction.sold).length;

        // Return the statistics
        return res.json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems,
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return res.status(500).json({ error: 'An error occurred while fetching the statistics.' });
    }
});

router.get('/barChart' , async (req, res) => {
    try {
        const month = req.query.month;

        // Convert month parameter to number
        let monthNumber = parseInt(month, 10);
        if (isNaN(monthNumber)) {
            monthNumber = getMonthNumber(month);
            if (!monthNumber) {
                return res.status(400).json({ error: 'Invalid month provided' });
            }
        }

        // Fetch data from the database
        const transactions = await ProductTransaction.find({});

        // Filter transactions by the selected month
        const filteredTransactions = transactions.filter(transaction => {
            const transactionMonth = moment(transaction.dateOfSale).month() + 1; // moment.month() returns 0-based index
            return transactionMonth === monthNumber;
        });

        // Define the price ranges
        const priceRanges = [
            { range: '0-100', min: 0, max: 100, count: 0 },
            { range: '101-200', min: 101, max: 200, count: 0 },
            { range: '201-300', min: 201, max: 300, count: 0 },
            { range: '301-400', min: 301, max: 400, count: 0 },
            { range: '401-500', min: 401, max: 500, count: 0 },
            { range: '501-600', min: 501, max: 600, count: 0 },
            { range: '601-700', min: 601, max: 700, count: 0 },
            { range: '701-800', min: 701, max: 800, count: 0 },
            { range: '801-900', min: 801, max: 900, count: 0 },
            { range: '901-above', min: 901, max: Infinity, count: 0 },
        ];

        // Count the number of transactions in each price range
        filteredTransactions.forEach(transaction => {
            for (const range of priceRanges) {
                if (transaction.price >= range.min && transaction.price <= range.max) {
                    range.count += 1;
                    break;
                }
            }
        });

        // Prepare the response
        const response = priceRanges.map(range => ({
            priceRange: range.range,
            itemCount: range.count,
        }));

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error generating bar chart data:', error);
        return res.status(500).json({ error: 'An error occurred while generating the bar chart data.' });
    }
});

router.get('/pieChart', async (req, res) => {
    try {
        const month = req.query.month;

        // Convert month parameter to number
        let monthNumber = parseInt(month, 10);
        if (isNaN(monthNumber)) {
            monthNumber = getMonthNumber(month);
            if (!monthNumber) {
                return res.status(400).json({ error: 'Invalid month provided' });
            }
        }

        // Fetch data from the database
        const transactions = await ProductTransaction.find({});

        // Filter transactions by the selected month
        const filteredTransactions = transactions.filter(transaction => {
            const transactionMonth = moment(transaction.dateOfSale).month() + 1; // moment.month() returns 0-based index
            return transactionMonth === monthNumber;
        });

        // Create an object to store category counts
        const categoryCounts = {};

        // Count the number of items in each category
        filteredTransactions.forEach(transaction => {
            const category = transaction.category;
            if (category) {
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
        });

        // Prepare the response
        const response = Object.entries(categoryCounts).map(([category, count]) => ({
            category,
            itemCount: count,
        }));

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error generating pie chart data:', error);
        return res.status(500).json({ error: 'An error occurred while generating the pie chart data.' });
    }
});

// Route to fetch data from all three APIs and return a combined response


module.exports = router;
