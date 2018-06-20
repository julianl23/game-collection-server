import mongoose from 'mongoose';
import MongooseRepository from '../../repositories/MongooseRepository';

class CompanyRepository extends MongooseRepository {
  get schema() {
    return {
      igdbId: Number,
      name: String,
      description: String,
      published: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Games'
        }
      ],
      developed: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Games'
        }
      ]
    };
  }

  get collectionName() {
    return 'companies';
  }

  get schemaName() {
    return 'Companies';
  }
}

/* Export the model for execution */
export default new CompanyRepository();
