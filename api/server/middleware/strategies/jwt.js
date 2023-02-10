import '../../config/config'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../../models/user'
const options = {}
/* jwt extraction from request header */
options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer')
/* jwt key */
options.secretOrKey = process.env.JWT_SECRET

const strategy = new JwtStrategy(options, function (jwt_payload, done) {
  User.findOne({ _id: jwt_payload.sub })
    .then((user) => {
      if (user) {
        return done(null, user)
      } else {
        /* Este else lo podemos hacer funcionar si en un futuro implementamos estrategias de facebook, etc. */
        return done(null, false)
        // or you could create a new account
      }
    })
    .catch((err) => done(err, false))
})

export default strategy
