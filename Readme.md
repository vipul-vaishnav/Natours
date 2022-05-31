# Express Mongo App

Natours is a simple implementation of express.js and mongodb

```js
// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from the server side!',
//     app: 'natours',
//     value: 200,
//   });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint');
// });

// GET
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);

// POST
app.post('/api/v1/tours', createTour);

// PATCH
app.patch('/api/v1/tours/:id', updateTour);

// DELETE
app.delete('/api/v1/tours/:id', deleteTour);
```
