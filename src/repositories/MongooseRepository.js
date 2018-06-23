import mongoose from 'mongoose';

class MongooseRepository {
  constructor() {
    const schema = this.getSchema();

    this.Model = mongoose.model(this.schemaName, schema);
  }

  get schema() {
    throw new Error(
      'Not implemented. Please provide a schema in your class definition.'
    );
  }

  get collectionName() {
    throw new Error(
      'Not implemented. Please provide a collectionName in your class definition.'
    );
  }

  get schemaName() {
    throw new Error(
      'Not implemented. Please provide a schemaName in you class definition'
    );
  }

  getSchema() {
    return new mongoose.Schema(this.schema, {
      collection: this.collectionName,
      timestamps: true
    });
  }

  insertMany(opts = {}) {
    return this.Model.insertMany(opts);
  }

  find(opts = {}) {
    return this.Model.find(opts);
  }

  create(opts = {}) {
    return this.Model.create(opts);
  }

  findOne(opts = {}) {
    return this.Model.findOne(opts);
  }

  findOneAndRemove(opts = {}) {
    return this.Model.findOneAndRemove(opts);
  }

  update(opts = {}) {
    return this.Model.update(opts);
  }

  updateOne(opts = {}) {
    return this.Model.updateOne(opts);
  }
}

export default MongooseRepository;
