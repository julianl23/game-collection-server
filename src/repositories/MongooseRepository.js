import mongoose from 'mongoose';
import elasticsearch from 'elasticsearch';

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_URL,
  log: 'error'
});

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
    // TOOD: Add elasticsearch syncing here. Use indexGames as an example
    return this.Model.insertMany(opts);
  }

  find(opts = {}) {
    return this.Model.find(opts);
  }

  async create(opts = {}) {
    try {
      const created = await this.Model.create(opts);
      await client.create({
        index: this.collectionName,
        type: this.collectionName,
        id: created._id.toString(),
        body: opts
      });
      return created;
    } catch (error) {
      return error;
    }
  }

  findOne(opts = {}) {
    return this.Model.findOne(opts);
  }

  async findOneAndRemove(opts = {}) {
    try {
      await client.delete({
        index: this.collectionName,
        type: this.collectionName,
        id: opts._id
      });
      return this.Model.findOneAndRemove(opts);
    } catch (error) {
      return error;
    }
  }

  update(opts = {}) {
    // TODO: Implement elasticsearch syncing here
    // try {
    //   await client.update({
    //     index: this.collectionName,
    //     type: this.collectionName,
    //     id: opts._id,
    //     body: opts
    //   });
    //   return this.Model.update(opts);
    // } catch (error) {
    //   return error;
    // }

    return this.Model.update(opts);
  }

  async updateOne(opts = {}) {
    try {
      await client.update({
        index: this.collectionName,
        type: this.collectionName,
        id: opts._id,
        body: opts
      });
      return this.Model.findOneAndRemove(opts);
    } catch (error) {
      return error;
    }
  }

  count(opts = {}) {
    return this.Model.count(opts);
  }

  async search(opts = {}) {
    try {
      const response = await client.search(opts);
      return response.hits.hits.map(item => ({
        _id: item._id,
        ...item._source
      }));
    } catch (error) {
      return error;
    }
  }
}

export default MongooseRepository;
