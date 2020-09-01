const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({
  path: `${__dirname}/../../config.env`,
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

(async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('DB connection successful!');
  } catch (err) {
    console.log(`Couldn't connect to DB, error: ${err}`);
  }
})();

let tours;

try {
  tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
  );
} catch (err) {
  console.log(`Couldn't read files ${err}`);
}

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(`Could not update DB, Error: ${err.message}`);
  } finally {
    process.exit();
  }
};

// Tour.create(JSON.parse(tours)).catch(err =>
//   console.log(`Could not update DB, Error: ${err.message}`)
// );

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('DESTROYEDDD');
  } catch (err) {
    console.log(`Could not delete, error: ${err}`);
  } finally {
    process.exit();
  }
};

const deleteAndImport = async () => {
  await deleteData();
  await importData();
};

// deleteAndImport();

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
