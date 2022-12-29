const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const router = express.Router();

// Delete a Review Image
router.delete('/:imageId', requireAuth,
    async (req, res, next) => {
        const { user } = req;
        const { imageId } = req.params;
        const reviewImage = await ReviewImage.findByPk(imageId);
        if (reviewImage) {
            const review = await Review.findByPk(reviewImage.reviewId);
            if (review.userId === user.id) {
                await reviewImage.destroy();
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
                        "message": "Review Image couldn't be found",
                        "statusCode": 404
                    }
                )
            }
        } else {
            res.status(404);
            return res.json(
                {
                    "message": "Review Image couldn't be found",
                    "statusCode": 404
                }
            )
        }
    }
)

module.exports = router;
