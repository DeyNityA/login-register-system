const mongoose = require('mongoose');


mongoose.register= mongoose.createConnection(`${process.env.DB_URL}/Register`);

module.exports= mongoose;