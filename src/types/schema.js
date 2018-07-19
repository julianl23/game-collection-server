import { makeExecutableSchema } from 'graphql-tools';
import resolvers from '../resolvers/resolvers';

const typeDefs = `
type Query {
  games(query: String): [Game]
  game(_id: String): Game
  user(_id: String): User
}

type Mutation {
  AddGameToCollection(input: GameInput!): String,
  Login(input: LoginInput!): User
}

type Game {
  _id: String
  title: String
  developer: [String]
  publisher: [String]
  platforms: [String]
  releaseDate: String
  description: String
  createdAt: String
  updatedAt: String
  igdbId: Int
  cover: Cover,
  gameModes: [String]
  multiplayerModes: [MultiplayerMode]
}

input GameInput {
  _id: String,
  platform: String,
  note: NoteInput,
  borrowed: Boolean,
  borrowedDate: String,
  cost: Float,
  details: DetailsInput
}

input NoteInput {
  text: String,
  isPrivate: Boolean
}

input DetailsInput {
  hasCartDiskItem: Boolean,
  hasCaseBox: Boolean,
  hasManual: Boolean,
  hasOtherInserts: Boolean
}

input LoginInput {
  email: String,
  password: String
}

type User {
  _id: String
  email: String
  username: String
  firstName: String
  lastName: String
  createdAt: String
  updatedAt: String
  token: String
}

type Cover {
  url: String,
  width: Int,
  height: Int,
  cloudinary_id: String
}

type MultiplayerMode {
  platform: String,
  offlinecoop: Boolean,
  onlinecoop: Boolean,
  lancoop: Boolean,
  campaigncoop: Boolean,
  splitscreenonline: Boolean,
  splitscreen: Boolean,
  dropin: Boolean,
  offlinecoopmax: Int,
  onlinecoopmax: Int,
  onlinemax: Int,
  offlinemax: Int
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
