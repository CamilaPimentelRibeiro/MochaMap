const express = require('express');
const cafeController = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = 'AIzaSyAAiWLw7jE5G1MkBXg_Dw4dsTXDP5de3CU';

cafeController.get('/cafes', async (req, res) => {
    const filePath = path.join(`${__dirname}/../models/data`, 'cafe.json');
    const cacheTime = 24 * 60 * 60 * 1000; // 24h

    // Function to check file age and decide if we need to update
    const isCacheValid = (fileStats) => {
        const now = new Date().getTime();
        const modifiedTime = new Date(fileStats.mtime).getTime();
        return now - modifiedTime < cacheTime;
    };

    try {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (isCacheValid(stats)) {
                console.log('Using cached data');
                const data = fs.readFileSync(filePath, 'utf8');
                res.json(JSON.parse(data));
                return;
            }
        }
        console.log('Cache is invalid or does not exist, fetching new data');
        const data = await fetchAndSaveCafes();
        fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch or read cache:', error);
        res.status(500).send('Error fetching cafe data');
    } finally {
        filterTopCafes(); //check if this can stay here 
    }
});

const fetchAndSaveCafes = async () => {
    const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const query = 'cafes in Vancouver'; // you can modify this query for different cities!
    let results = [];
    let next_page_token = null;

    const fetchCafes = async (pageToken) => {
        const params = {
            query: query,
            key: API_KEY,
            pagetoken: pageToken, // starts null but is updated while the data is loaded
        };

        // Wait a lil time since this takes a while, test to see if this can be faster
        if (pageToken) await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Searching for:', query);
        const response = await axios.get(apiUrl, { params });
        const data = response.data;
        if (data.results && data.results.length) {
            results = results.concat(data.results.slice(0, 100 - results.length));
            console.log(`Fetched ${data.results.length} cafes, total so far: ${results.length}`);
            next_page_token = data.next_page_token;
        } else {
            next_page_token = null;
        }
    };

    // Start getting the first page
    await fetchCafes(next_page_token);
    // Continue fetching subsequent pages
    while (results.length < 100 && next_page_token) {
        await fetchCafes(next_page_token);
    }

    console.log('Saving and responding with cafe data');
    return { results }; // Return data
}

const filterTopCafes = async () => {
    const inputFilePath = path.join(`${__dirname}/../models/data`, 'cafe.json');
    const outputFilePath = path.join(`${__dirname}/../models/data`, 'top20Cafes.json');

    // Read the existing cafes file
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Parse JSON data and sort by rating
        let cafes = JSON.parse(data);
        if (cafes.results) {
            cafes = cafes.results;
        }

        // Sort cafes by rating in descending order and get the top 20
        const topCafes = cafes.sort((a, b) => b.rating - a.rating).slice(0, 20);

        // Write the top 20 cafes to a new JSON file
        fs.writeFile(outputFilePath, JSON.stringify({ results: topCafes }, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('Top 20 cafes have been saved to a new file.');

        });
    });
}

cafeController.get('/top20', (req, res) => {
    const filePath = path.join(`${__dirname}/../models/data`, 'top20Cafes.json');
    res.sendFile(filePath);
});


module.exports = cafeController;