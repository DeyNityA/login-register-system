const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
var conn= require('../connection/url');


const urlSchema= new mongoose.Schema({
    shortId:{
        type:String,
        required:true,
        unique:true
    },
    redirectUrl:{
        type:String,
        required:true,
    },
    visitHistory:[
        {
            timestamp:{
                type: Number
            }
        }
    ]
},{timestamps:true}
);
urlSchema.plugin(uniqueValidator, {
    message: "Error, {PATH} already exists.",
  });

  const URL= conn.url.model('url',urlSchema);

  module.exports = URL;