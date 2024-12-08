const express = require('express');
const {
  getAllTours,
  addNewTour,
  getTour,
  updatedTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/tourController');

const router = express.Router();
// router.param('id', checkID);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours)

router.route('/tours-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);


router.route('/').get(getAllTours).post(addNewTour);

router.route('/:id').get(getTour).patch(updatedTour).delete(deleteTour);

module.exports = router;
