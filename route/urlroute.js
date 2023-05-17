const express = require("express");
const router = new express.Router();
const shortid = require('shortid');
const Url = require("../db/module/url");


router.get('/',async function (req, res) {
  const allurls= await Url.find();
    res.render('url',{allurls});
});

router.post("/", async function (req, res) {
  try {
    const shortID= shortid.generate();
    const result= await Url.create({
      shortId : shortID,
      redirectUrl: req.body.redirectUrl,
      visitHistory: []
})
    res.render('url',{result});
  } catch (err) {
    console.log(err.message);
  }
});

router.get('/:sid',async function (req, res) {
  const shortID = req.params.sid;
  const result= await Url.findOneAndUpdate({shortId : shortID},{$push : {visitHistory:{
    timestamp: Date.now(),
    }}
  })
  res.redirect(result.redirectUrl)
});


module.exports = router;
