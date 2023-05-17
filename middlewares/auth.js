const{getUser}=require('../service/auth')
 function restrictToLoggedinUserOnly(req, res, next){
  const userId= req.cookies?.uid;

  if(!userId) {
    
    console.log('cache is invalid')
    return res.redirect('/login');
  }
  const user = getUser(userId);
  if(!user){
    console.log('hash is invalid');
    return res.redirect('/login');
  }
  req.user = user;
  next();
}

module.exports = restrictToLoggedinUserOnly;