const passport = require('passport');
const Users = require('../model/users.model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const googleLoginProvider = async () => {
    try {
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_CLIENTSECRET,
            callbackURL: "http://localhost:8000/api/v1/users/google/callback"
        },
            async function (accessToken, refreshToken, profile, cb) {
                try {
                    let user = await Users.findOne({ googleId: profile.id });
                    console.log(user);
                    if (!user) {
                        user = await Users.create({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            role: "user"
                        })

                        console.log(user, {
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            role: "user"
                        });
                        return cb(null, user);
                    }
                } catch (error) {
                    console.log(error);
                    return cb(error, null);
                }
            }
        ));

        passport.serializeUser(function (user, done) {
            console.log("serializeUser", user);
            done(null, user);
        });

        passport.deserializeUser(async function (id, done) {
            console.log("deserializeUser", id);
            try {
                let user = await Users.findById(id)
               console.log(user);
               
                if(!user){
                    return done(error, null);
                    
                }
                done(null, user)
            } catch (error) {
                done(error, null);
            }
            // await Users.findById(id, function (err, user) {

            // });

            // let user = await Users.findOne({ _id: id });
        });
    } catch (error) {
        console.log(error);
    }

}

const facebookLoginProvider = async () => {
    try {
        passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENTID,
            clientSecret: process.env.FACEBOOK_CLIENTSECRET,
            callbackURL: "http://localhost:8000/api/v1/users/facebook/callback",
            enableProof: true,
            profileFields: ["id", "displayName", "emails"]
        },
            async function (accessToken, refreshToken, profile, cb) {
                console.log(profile, "ok");
                try {
                    let user = await Users.findOne({ facebookId: profile.id });
                    console.log(user, "suifg", profile.emails[0].value);
                    if (!user) {
                        user = await Users.create({
                            name: profile.displayName,
                            email: profile.emails ? profile.emails[0].value : null,
                            // email: profile.emails[0].value,
                            facebookId: profile.id,
                            role: "user"
                        })
                        return cb(null, user);
                    }
                } catch (error) {
                    console.log(error);
                    return cb(error, null);
                }
                // Users.findOrCreate({ facebookId: profile.id }, function (err, user) {
                //     return cb(err, user);
                // });
            }
        ));
        passport.serializeUser(function (user, done) {
            console.log("serializeUser", user);
            done(null, user);
        });
        passport.deserializeUser(async (id, done) => {
            console.log("deserializeUser", id);
            try {
                const user = await Users.findById(id);
                done(null, user.id);
            } catch (error) {
                console.error('Error deserializing user:', error);
                done(error, null);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { googleLoginProvider, facebookLoginProvider }