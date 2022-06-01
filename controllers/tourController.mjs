import { readFileSync, writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Tour from '../models/tourModel.mjs';
import APIFeatures from '../utils/APIFeatures.mjs';

// ===============================================================================================
//The 'fileURLToPath' method returns the fully-resolved platform-specific Node.js file path.
const __filename = fileURLToPath(import.meta.url);

// use the 'dirname()' method from the 'path' module. The 'dirname' method takes a path as a parameter and returns the directory name of the 'path'.
const __dirname = path.dirname(__filename);

// Reading files synchronously
const readFileFunc = (path) => {
  return readFileSync(`${path}`, 'utf-8');
};
// ===============================================================================================

// Tours Path
const toursPath = path.join(__dirname, '../', 'dev-data', 'data', 'tours-simple.json');

// Reading file at 'toursPath' path
// const tours = JSON.parse(readFileFunc(toursPath));

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  try {
    // @build query
    // // 1) simple filtering
    // const queryObj = Object.assign({}, req.query);
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((field) => delete queryObj[field]);

    // // 2) advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // // gte, gt, lte, lt
    // let query = Tour.find(JSON.parse(queryStr));

    // // 3) sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // // 4) field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // 5) Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // const skip = (page - 1) * limit;

    // @e.g. page=3&limit=50
    // 1-50 on page 1
    // 51-100 on page 2
    // 101-150 on page 3
    // therefore skipVal = 100 => (3 - 1) * 50 => (page - 1) * limit
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const num_of_tours = await Tour.countDocuments();
    //   if (skip >= num_of_tours) {
    //     throw new Error('This page does not exist.');
    //   }
    // }

    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limit().paginate();

    // @executing query
    const tours = await features.query;

    // @sending response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export {
  getAllTours,
  aliasTopTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan /*checkBody checkID*/,
};

//====================================================================================================

// Check ID

// const checkID = (req, res, next, val) => {
//   console.log('Tour id: ', val);

//   const { id } = req.params;

//   if (id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   next();
// };

//====================================================

// Check body

// const checkBody = (req, res, next) => {
//   console.log(req.body);

//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }

//   next();
// };

//=======================================================

// create Tour

// const newID = tours[tours.length - 1].id + 1;
// const newTour = Object.assign({ id: newID }, req.body);
// tours.push(newTour);
// writeFile(toursPath, JSON.stringify(tours), (err) => {
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

// =========================================

//  get tour

// const { id } = req.params;
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour: tours[+id],
//   },
// });

// ======================================

// update tour

// res.status(200).json({
//   status: 'success',
//   data: {
//     tour: '<updated tour here>',
//   },
// });

// =========================================

// delete tour

// const deleteTour = (req, res) => {
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
