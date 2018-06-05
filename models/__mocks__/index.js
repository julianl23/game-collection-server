// TODO: Having to do this manually feels REAL bad. Figure out a better way of mocking this, or switch to Mongoose.
// The whole "sequelize builds an index file" thing feels odd, mostly because it requires a sequelize object
// to be passed in.

const mock = {
  User: {
    find: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndRemove: jest.fn(),
    findOrCreate: jest.fn().mockReturnValue({
      spread: jest.fn()
    })
  },
  Game: {
    find: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndRemove: jest.fn(),
    findOrCreate: jest.fn()
  }
};

export default mock;
