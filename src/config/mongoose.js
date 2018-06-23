import mongoose from 'mongoose';

// TODO: Move this to an external somewhere like an env variable
const dbAddress = 'mongodb://127.0.0.1:27017';

const setupMongoose = async () => {
  // set the promise used by mongo to be native promises
  mongoose.Promise = global.Promise;

  const dbconnection = mongoose.connection;

  dbconnection.on('connected', () => {
    console.log('Connected to mongoose'); // eslint-disable-line no-console
    // debug('Connected to mongoose');
  });

  dbconnection.on('error', () => err => {
    // debug(err);
    console.log(err); // eslint-disable-line no-console
  });

  dbconnection.on('disconnected', () => {
    // debug('Mongoose disconnected');
    console.log('Mongoose disconnected'); // eslint-disable-line no-console
  });

  await mongoose.connect(dbAddress, {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500,
    dbName: 'gamecollection'
  });
};

export const disconnectMongoose = async () => {
  await mongoose.disconnect();
};

export default setupMongoose;
