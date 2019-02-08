let router = require('express').Router();

const ru = require('../models/ru.js');

router.get('/today', async (req, res) => {
    const menu = await ru.thisWeek();
    const day = new Date().toDateString().split(' ')[0].toLowerCase();
    res.status(200).send(menu[day]);
});

router.get('/week', async (req, res) => {
    const menu = await ru.thisWeek();
    res.status(200).send(menu);
});

module.exports = router;
