require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieSession = require("cookie-session");

// Web server config
const PORT = process.env.PORT || 5009;
const ENV = process.env.ENV || "development";

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();
const dbHelpers = require("./dbHelpers/dbHelpers")(db);

const app = express();
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["123456", "09876"],
  })
);

// Separated Routes for each Resource
const loginRoute = require("./routes/login_route");
const pinsRoute = require("./routes/pins");
const registerRoute = require("./routes/register_route");
const userRoute = require("./routes/user_route");

// Mount all resource routes
app.use("/login", loginRoute(dbHelpers));
app.use("/pins", pinsRoute(dbHelpers));
app.use("/register", registerRoute(dbHelpers));
app.use("/user", userRoute(dbHelpers));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
