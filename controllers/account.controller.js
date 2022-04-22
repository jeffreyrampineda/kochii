const express = require("express");
const router = express.Router();
const AccountService = require('../services/account.service');
const Validate = require('../validators/account');
const createError = require("http-errors");

/**
 * PUT /api/account
 * Updates the current account.
 * @response { JSON, error? } updated account if successful otherwise, an error.
 */
 router.put('/', async function (req, res, next) {
    try {
        const { firstName, lastName } = await Validate.update(req.body);

        const account = await AccountService.updateAccount(req.user, firstName, lastName);
        res.status(200).json(account);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

/**
 * DEL /api/account
 * Delete the current account. 
 * @response { JSON, error? } delete's ok result otherwise, an error.
 */
router.delete('/', async function (req, res, next) {
    try {
        const result = await AccountService.deleteAccountById(req.user);

        res.status(200).json(result);
    } catch (error) {
        next(createError(error.status ?? 500, error));
    }
});

module.exports = router;
