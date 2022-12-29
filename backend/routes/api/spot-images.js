const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const router = express.Router();

// Delete a Spot Image
router.delete('/:imageId', requireAuth, 
    async (req, res, next) => {
        const { user } = req;
        const { imageId } = req.params;
        const spotImage = await SpotImage.findByPk(imageId);

        if (spotImage) {
            const spot = await Spot.findByPk(spotImage.spotId);
            if (spot.ownerId === user.id) {
                await spotImage.destroy();
                return res.json(
                    {
                        "message": "Successfully deleted",
                        "statusCode": 200
                    }
                )
            } else {
                res.status(404);
                return res.json(
                    {
                        "message": "Spot Image couldn't be found",
                        "statusCode": 404
                    }
                )
            }
        } else {
            res.status(404);
            return res.json(
                {
                    "message": "Spot Image couldn't be found",
                    "statusCode": 404
                }
            )
        }
    }
);


module.exports = router;
