import express from 'express';
import { readFileSync, writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialising express app
const app = express();

// middleware
app.use(express.json());

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
const toursPath = path.join(
  __dirname,
  'dev-data',
  'data',
  'tours-simple.json'
);

// Reading file at 'toursPath' path
const tours = JSON.parse(readFileFunc(toursPath));

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

  if (+id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

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
  const { id } = req.params;

  if (id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here>',
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  if (id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// // GET
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);

// // POST
// app.post('/api/v1/tours', createTour);

// // PATCH
// app.patch('/api/v1/tours/:id', updateTour);

// // DELETE
// app.delete('/api/v1/tours/:id', deleteTour);

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Listening to requests on port 3000
const port = 3000;
app.listen(port, () => {
  console.log('App running on port: ' + port);
});

// app.get('/', (req, res) => {
//     res.status(200).json({
//       message: 'Hello from the server side!',
//       app: 'natours',
//       value: 200,
//     });
//   });

//   app.post('/', (req, res) => {
//     res.send('You can post to this endpoint');
//   });
