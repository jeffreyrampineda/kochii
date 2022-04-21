const express = require("express");
const router = express.Router();
const ActivityService = require('../services/activity.service');

/**
 * GET /api/activities
 * Get all the account's activities from the database.
 * @response { JSON, error? } array of activities objects if successful otherwise, an error. 
 */
router.get('/', async function (req, res) {
    try {
        const activities = await ActivityService.getActivities(req.user);
        res.status(200).json(activities);
    } catch (error) {
        res.status(error.status ?? 500).json(error);
    }
});

/**
 * GET /api/activities/:days
 * Gets all items and activities from the database since the specified days.
 * @requires { number } days
 * @response { JSON, error? } An object that contains activities and items.
 */
router.get('/:days', async function (req, res) {
    try {
        console.log(req.params);
        const { days = 1 } = req.params;
        const activities = await ActivityService.getActivitiesSince(req.user, days);
        res.status(200).json(activities);
    } catch (error) {
        console.log('error')
        res.status(error.status ?? 500).json(error);
    }
});

router.delete('/', async function (req, res) {
    try {
        const result = await ActivityService.clearActivities(req.user);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status ?? 500).json(error);
    }
});

module.exports = router
