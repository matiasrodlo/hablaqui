import localStrategy from "../middleware/strategies/local";
import jwtStrategy from "../middleware/strategies/jwt";
import googleStragey from "../middleware/strategies/google";
//If we want to add  strategies or functions like serialize and deserialize we use this function
const passportConfig = (passport) => {
  passport.use("local", localStrategy);
  passport.use("jwt", jwtStrategy);
  passport.use("google", googleStragey);
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};

export default passportConfig;
