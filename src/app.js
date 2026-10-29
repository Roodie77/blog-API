const path = require('path');
const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorhandler');
const articleRoutes = require('./routes/article.route');
const userRoutes = require('./routes/user.route');

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get("/", (req, res) => {
  res.json({ message: "jonathan API is running" });
});

app.use("/api/user/", userRoutes);
app.use('/api', articleRoutes);

app.use(errorHandler);

module.exports = app;
