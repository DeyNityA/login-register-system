const mongoose = require('mongoose');


mongoose.url= mongoose.createConnection(`${process.env.DB_URL}/Url`);

module.exports= mongoose;