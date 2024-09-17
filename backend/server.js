const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const coookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const connectDb = require("./config/db");
const xss = require("xss-clean");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.options("*", cors());

// load env vars
dotenv.config({
  path: "./config/config.env",
});

//connect to database
connectDb();
// Route Files
const auth = require("./routes/user");
const friend = require("./routes/friend");
const recommendation = require("./routes/recommendation");
const { errorHandler } = require("./middleware/error.middleware");

// Body Parser
app.use(express.json());
app.use(coookieParser());

//dev loggin middleware
app.use(morgan("dev"));

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

// prevent xss attacks
app.use(xss());

app.get("/_health", (req, res) => {
  res.status(200).send("ok");
});

// Mount Routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/friend", friend);
app.use("/api/v1/recommendation", recommendation);

// global middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

module.exports = app;
