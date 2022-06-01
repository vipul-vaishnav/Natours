import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Tour from '../../models/tourModel.mjs';

dotenv.config({ path: './config.env' });

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
const toursPath = path.join(__dirname, 'tours-simple.json');

// Reading file at 'toursPath' path
const tours = JSON.parse(readFileFunc(toursPath));

// connecting to db
console.log(process.env.NODE_ENV);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => console.log('DB CONNECTED'));

// IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('DATA SUCCESSFULLY LOADED');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('DATA SUCCESSFULLY DELETED');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
