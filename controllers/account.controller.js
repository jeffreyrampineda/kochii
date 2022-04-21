const express = require("express");
const router = express.Router();
const AccountService = require('../services/account.service');
const Validate = require('../validators/account');

/**
 * PUT /api/account
 * Updates the current account.
 * @response { JSON, error? } updated account if successful otherwise, an error.
 */
 router.put('/', async function (req, res) {
    try {
        const { errors, firstName, lastName } = await Validate.update(req.body);

        if (Object.keys(errors).length) {
            throw { status: 400, ...errors };
        }
        const account = await AccountService.updateAccount(req.user, firstName, lastName);
        res.status(200).json(account);
    } catch (error) {
        res.status(error.status ?? 500).json(error);
    }
});

/**
 * DEL /api/account
 * Delete the current account. 
 * @response { JSON, error? } delete's ok result otherwise, an error.
 */
router.delete('/', async function (req, res) {
    try {
        const result = await AccountService.deleteAccountById(req.user);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status ?? 500).json(error);
    }
});

module.exports = router;
