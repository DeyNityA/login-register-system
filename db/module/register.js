
const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const passwordValidator = require("password-validator");
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')

var conn= require('../connection/register');


// const createToken= async ()=>{
//   const token = await jwt.sign({_id:_id},securitykey,{expiresIn:'300s'});
//   console.log(token);
//   const userver= await jwt.verify(token,securitykey);
//   console.log(userver);
// }

var passSchema = new passwordValidator();
passSchema
  .is()
  .min(8)
  .is()
  .max(60)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces()
  .has()
  .symbols();

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    uppercase: true,
    minLength: 3,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error("{PATH} format is wrong");
      }
    },
    required: true
  },
  phone_no: {
    type: String,
    minLength: 10,
    maxLength: 10,
    validate: (value) => {
      if (!validator.isMobilePhone(value))
        throw new Error("{VALUE} is not a valid mobile phone number");
    },
    required: [true, "Phone number must be required"],
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
    trim: true,
    validate: (value) => {
      if (!passSchema.validate(value))
        throw new Error(
          passSchema.validate(value, { details: true })[0].message
        );
    },
    required: true
  },
  confirm_password: {
    required: true,
    type: String,
    trim: true,
  },
  tokens: [{
    token:{
    type: String,
    required: true
      }
  }]
});

usersSchema.plugin(uniqueValidator, {
  message: "Error, {PATH} already exists.",
});

//generating token
usersSchema.methods.generateAuthToken = async function(){
  try {
  const Token = await jwt.sign({_id: this._id}, process.env.SECRET_KEY);
  this.tokens = this.tokens.concat({token:Token});
  return Token;
  }
  catch (err) {
    console.log(err.message);
  }
}

//converting password into hash
usersSchema.pre("save", async function(next){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10);
    this.confirm_password = undefined;
  }
  next();
})

const User = conn.register.model("user", usersSchema);

module.exports = User;
