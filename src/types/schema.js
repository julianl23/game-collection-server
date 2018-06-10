import { makeExecutableSchema } from 'graphql-tools';
import resolvers from '../resolvers/resolvers';

// Examples from https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035?_ga=2.16070707.401638683.1527376000-1121082364.1527376000
// `
// type Query {
//   author(firstName: String, lastName: String): Author,
//   allAuthors: [Author]
//   getFortuneCoolie: String
//   games: [Game]
// }

// type Author {
//   id: Int
//   firstName: String
//   lastName: String
//   posts: [Post]
// }

// type Post {
//   id: Int
//   title: String
//   text: String
//   views: Int
//   author: Author
// }
// `

const typeDefs = `
type Query {
  games: [Game]
  game(id: String): Game
  user(id: String): User
}

type Game {
  id: String
  title: String
  developer: String
  publisher: String
  platform: String
  releaseDate: String
  description: String
  createdAt: String
  updatedAt: String
}

type User {
  id: String
  email: String
  username: String
  firstName: String
  lastName: String
  createdAt: String
  updatedAt: String
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
