const fastifyPassport=require('@fastify/passport')
const GoogleStrategy= require('passport-google-oauth20').Strategy
const GithubStrategy= require('passport-github2').Strategy 
const User=require('../model/User')

// google
fastifyPassport.use("google",new GoogleStrategy({
  clientID: "1084805314648-iidnjt0lqi2ivn0e1cvmqpo66ba9ucan.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, cb) {
   // cb(undefined,profile)
   console.log(profile)
    if(profile.id){
      User.findOne({email:profile.emails[0].value})
      .then((user)=>{
         if(user){
          cb(undefined,user)
         }else{
          new User({
            name: profile.name.familyName + ' ' + profile.name.givenName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          }).save()
          .then(user => cb(undefined, user));
         }
    }
  )
  }
}));
// github
fastifyPassport.use("github",new GithubStrategy({
  clientID: "8cbb53140120b4bd80be",
  clientSecret: "09d902b17621ca490bab0e057f115518fcbd2d58",
  callbackURL: "http://localhost:5000/auth/github/callback"
  },
  function (accessToken, refreshToken, profile, cb) {
   // cb(undefined,profile)
   console.log(profile)
    if(profile.id){
      User.findOne({email:profile.email})
      .then((user)=>{
         if(user){
          cb(undefined,user)
         }else{
          new User({
            name: profile.displayName,
            email: profile.email,
            image: profile.photos[0].value,
            address:profile.location,
          }).save()
          .then(user => cb(undefined, user));
         }
    }
  )
  }
}));
fastifyPassport.registerUserDeserializer(async(user,req)=>{
  return user
})
fastifyPassport.registerUserSerializer(async(user,req)=>{
  return user
})
