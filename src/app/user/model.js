import MongooseRepository from '../../repositories/MongooseRepository';

class UserRepository extends MongooseRepository {
  get schema() {
    return {
      buildingId: String,
      email: String,
      username: String,
      password: String,
      firstName: String,
      lastName: String,
      admin: Boolean
    };
  }

  get collectionName() {
    return 'users';
  }

  get schemaName() {
    return 'Users';
  }
}

/* Export the model for execution */
export default new UserRepository();
