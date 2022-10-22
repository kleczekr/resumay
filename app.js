const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");
const session = require("express-session");

// load config
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// specify the HTML engine for Express
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/script"));

const PORT = process.env.PORT || 5500;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
