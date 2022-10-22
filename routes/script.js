const express = require('express')
const router = express.Router()
const { MongoClient } = require('mongodb')
const client = new MongoClient(process.env.MONGO_URI)
const NodeCache = require('node-cache')

// stdTTL is the time to live in seconds for every generated cache element.
const myCache = new NodeCache({ stdTTL: 7200 })

async function run() {
    return
}

// @desc    Show all items
// @route   GET /
router.get('/', async (req, res) => {
    try {
        res.render('index')
    } catch (err) {
        console.error(err)
    }
})

// @desc    Generate an accessible JSON with data for the resumay
// @route   GET /data/json
router.get('/data/json', async function (req, res) {
    // let all_items = await run();
    let all_items = myCache.get('allItems')

    // if there was no information in the cache, connect
    // to the database and update cache
    if (all_items == null) {
        all_items = await run()
        myCache.set('allItems', all_items, 7200)
    }
    const data = all_items
    res.send(data)
})

module.exports = router
