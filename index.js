require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

const app = express();
const restrictToLoggedinUserOnly= require('./middlewares/auth');
const router = require("./route/route");
const urlrouter = require('./route/urlroute');

// const securePassword = async (password)=>{
// const hashpassword=await bcrypt.hash(password,10);
// console.log(hashpassword);
// const passwordmatch = await bcrypt.compare(password,hashpassword);
// console.log(passwordmatch);
// }
const publicpath = path.join(__dirname,  "public");
const viewspath = path.join(__dirname,  "template", "views");
const partialpath = path.join(__dirname,  "template", "partials");
app.use(express.static(publicpath));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "hbs");
app.set("views", viewspath);
hbs.registerPartials(partialpath);


app.use(router);
app.use('/url',restrictToLoggedinUserOnly,urlrouter);

app.listen(port, () => {
  console.log("listening on port", port);
});
