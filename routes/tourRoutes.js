const express = require('express');
const {
  getAllTours,
  addNewTour,
  getTour,
  updatedTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();
// router.param('id', checkID);

router.route('/').get(getAllTours).post(addNewTour);

router.route('/:id').get(getTour).patch(updatedTour).delete(deleteTour);

module.exports = router;
