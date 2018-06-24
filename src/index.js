// Load a file to handle .env imports. See src/.env.js for more info
import './env';
import { bootstrapApp } from './app';

/* Create HTTP server. */
const startAppServer = async () => {
  const server = await bootstrapApp();
  await server.start();
  server.logger().info('App server is running');
};

startAppServer();
