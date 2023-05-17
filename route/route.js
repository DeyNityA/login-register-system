const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { setUser} = require("../service/auth");
const User = require("../db/module/register");


const router = new express.Router();

router.get("/", function (req, res) {
  res.render("index");
});
router.get("/index", function (req, res) {
  console.log("Cookies: ", req.cookies);
  res.render("index");
});
router.get("/register", function (req, res) {
  res.render("register");
});
router.post("/register", async function (req, res) {
  if (req.body.password === req.body.confirm_password) {
    try {
      const document = new User(req.body);
      const token = await document.generateAuthToken();
      // res.cookie('jwt_token', token);
      // res.cookie('jwt_token', token,{
      //   expires: new Date(Date.now()+30000),
      //   httpOnly: true
      // });
      let result = await document.save(); //all validation will  check here
      res.redirect("index");
    } catch (err) {
      res.send(err.message);
    }
  } else res.send("Password Not Matched");
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const result = await User.findOne({ email: email });
    const ismatch = await bcrypt.compare(password, result.password);
    if (ismatch) {
      // Cookies that have not been signed
      console.log("Cookies: ", req.cookies);
      // Cookies that have been signed
      console.log("Signed Cookies: ", req.signedCookies);
      // await result.generateAuthToken();
      const sessionId = uuidv4();
      setUser(sessionId, result);
      res.cookie("uid", sessionId);

      res.redirect("/index");
    } else {
      res.send("password is incorrect");
    }
  } catch (err) {
    res.send("email does not exist");
  }
});

module.exports = router;
