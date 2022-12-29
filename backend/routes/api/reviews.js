const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, ReviewImage, sequelize } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateImage = [
    check('url')
        .exists({checkFalsy: true})
        .withMessage('Please provide image url'),
    handleValidationErrors
];
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

// Get all Reviews of the Current User
router.get(
    '/current',
    requireAuth,
    restoreUser,
    async (req, res, next) => {
        const { user } = req;

        const reviews = await Review.findAll({
            where: {
                userId: parseInt(user.id)
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'description']
                    }
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }  
            ]
        });
        const newReviews = [];
        for (let review of reviews) {
            const previewImage = await SpotImage.findOne({
                attributes: ['url'],
                raw: true
            });
            review = review.toJSON()
            if (previewImage){
                review.Spot.previewImage = previewImage.url
            }
            newReviews.push(review)
        }
        if (reviews) {
            return res.json({ Reviews: newReviews })
        }
    }
);

// Add an Image to a Review based on the Review's id
router.post(
    '/:reviewId/images',
    requireAuth,
    restoreUser,
    validateImage,
    async (req, res, next) => {
        const { user } = req;
        const { reviewId } = req.params;
        const { url } = req.body;
        const review = await Review.findByPk(parseInt(reviewId));
        
        if (review) {
            const reviewImageCount = await ReviewImage.count({
                where: {
                    reviewId: review.id
                }
            });
    
            if (reviewImageCount >= 10) {
                res.status(403);
                return res.json({
                    "message": "Maximum number of images for this resource was reached",
                    "statusCode": 403
                })
            };
            if (review.userId === user.id && reviewImageCount < 10) {
                const reviewImage = await ReviewImage.create({
                    reviewId: review.id,
                    url
                });
                const newReviewImage = await ReviewImage.findByPk(reviewImage.id, 
                    {
                        attributes: ['id', 'url']
                    }
                )
                return res.json(newReviewImage)
            } else {
                res.status(404);
                return res.json(
                    {
                        "message": "Review couldn't be found",
                        "statusCode": 404
                    }
                )
            }
        } else {
            res.status(404);
            return res.json(
                {
                    "message": "Review couldn't be found",
                    "statusCode": 404
                }
            )
        }
    }
);

// Edit a Review
router.put(
    '/:reviewId',
    requireAuth,
    restoreUser,
    validateReview,
    async (req, res, next) => {
        const { user } = req;
        const { reviewId } = req.params;
        const { review, stars } = req.body;
        const updateReview = await Review.findByPk(parseInt(reviewId));
        
        if (updateReview) {
            if (updateReview.userId === user.id) {
                updateReview.update({
                    review,
                    stars
                });

                return res.json(updateReview);
            } else {
                res.status(404);
                return res.json(
                    {
                        "message": "Review couldn't be found",
                        "statusCode": 404
                    }
                )
            }
        } else {
            res.status(404);
            return res.json(
                {
                    "message": "Review couldn't be found",
                    "statusCode": 404
                }
            )
        }
    }
);

// Delete a Review
router.delete(
    '/:reviewId',
    requireAuth,
    restoreUser,
    async (req, res, next) => {
        const { user } = req;
        const { reviewId } =  req.params;
        const review = await Review.findByPk(parseInt(reviewId));

        if (review) {
            if (review.userId === user.id) {
                await review.destroy();
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
                        "message": "Review couldn't be found",
                        "statusCode": 404
                    }
                )
            }
        } else {
            res.status(404);
            return res.json(
                {
                    "message": "Review couldn't be found",
                    "statusCode": 404
                }
            )
        }
    }
)

module.exports = router;
