const { PORT } = require('./config/env');
const app = require('./app');
const connectdb = require('./config/connectdb');


const startServer = async () => {
  await connectdb();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("API startup failed:", error.message);
  process.exitCode = 1;
});
