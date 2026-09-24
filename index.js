

require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectdb = require('./database/connectdb');
const logger = require('./middlewares/logger');

const errorHandler = require('./middlewares/errorhandler');
const articleRoutes = require('./routes/article.route');
const userRoutes = require('./routes/user.route');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(logger);
app.use('/api', articleRoutes);
app.use("/api/user/", userRoutes);
app.use(errorHandler);




app.get("/", (req, res) => {
  res.json({ message: "jonathan API is running" });
});

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