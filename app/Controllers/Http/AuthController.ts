import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request }) {
    try {
      const registerSchema = schema.create({
        email: schema.string([
          rules.email()
        ]),
        password: schema.string([
          rules.minLength(8),
          rules.maxLength(16)
        ])
      })

      await request.validate({ schema: registerSchema })
      const { email, password } = request.requestBody
      const user = User.create({
        email,
        password
      })
      return user
    } catch (err) {
      return err
    }
  }

  public async login({ auth, request }) {
    try {
      const { email, password } = request.requestBody
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7 days'
      })
      return token
    } catch (err) {
      return err
    }
  }

  public async logout({ auth }) {
    try {
      // await auth.use('api').logout()
      await auth.use('api').revoke()
      return {
        revoked: true
      }
    } catch (err) {
      return err
    }
  }
}
