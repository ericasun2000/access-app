require("dotenv").config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = ({ addUser, isUserRegistered, getUserByEmail }) => {
  // gets the registration route and passes the cookie session
  router.get("/", (req, res) => {
    // const templateVars = {
    //   user: req.session["user"],
    //   userId: req.session["user_id"],
    // };
    // res.render("register", templateVars);
  });

  // checks whether the users email already exists in the db
  // either redirects them to home or asks them to login
  router.post("/", (req, res) => {
    console.log("hello from register");
    const { email, password, username } = req.body;
    isUserRegistered(email)
      .then((isRegistered) => {
        if (!isRegistered) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          addUser(email, hashedPassword, username)
            .then((row) => {
              const userEmail = row.email;
              return getUserByEmail(userEmail);
            })
            .then((returnedUser) => {
              const payload = {
                user: {
                  id: returnedUser.id,
                },
              };

              jwt.sign(
                payload,
                process.env.JWTSECRET,
                {
                  expiresIn: 360000,
                }, //optional
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    token,
                  });
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          res.status(400).send("Please login.");
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return router;
};
