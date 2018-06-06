import MongooseRepository from '../../repositories/MongooseRepository';

class UserRepository extends MongooseRepository {
  get schema() {
    return {
      email: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
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
