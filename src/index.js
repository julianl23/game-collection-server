import { bootstrapApp } from './app';

/* Create HTTP server. */
const startAppServer = async () => {
  const server = await bootstrapApp();
  await server.start();
  server.logger().info('App server is running');
};

startAppServer();
