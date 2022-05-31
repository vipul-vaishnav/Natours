import { readFileSync, writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
const tours = JSON.parse(readFileFunc(toursPath));

// Check ID

const checkID = (req, res, next, val) => {
  console.log('Tour id: ', val);

  const { id } = req.params;

  if (id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

// Check body

const checkBody = (req, res, next) => {
  console.log(req.body);

  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }

  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: 'success',
    data: {
      tour: tours[+id],
    },
  });
};

const createTour = (req, res) => {
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);
  writeFile(toursPath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here>',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

export { getAllTours, createTour, getTour, updateTour, deleteTour, checkID, checkBody };
