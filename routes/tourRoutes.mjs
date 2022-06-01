import express from 'express';
import {
  getAllTours,
  aliasTopTours,
  createTour,
  getTour,
  updateTour,
  // checkID,
  deleteTour,
  // checkBody,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController.mjs';

const tourRouter = express.Router();

// middleware
// tourRouter.param('id', checkID);

// Tour Routes

tourRouter.route('/tour-stats').get(getTourStats);

tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter.route('/top-5-cheapest-tour').get(aliasTopTours, getAllTours);

tourRouter.route('/').get(getAllTours).post(createTour /*checkBody*/);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
