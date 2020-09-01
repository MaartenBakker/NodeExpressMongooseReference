const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
  path: `${__dirname}/config.env`,
});

const app = require(`./app`);

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

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
