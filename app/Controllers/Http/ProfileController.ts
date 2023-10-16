import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'

export default class AuthController {
    profileSchema = schema.create({
    name: schema.string([
      rules.minLength(3),
      rules.maxLength(30)
    ]),
    mobile: schema.string([
      rules.mobile({
        locale: ['en-IN']
      })
    ]),
    gender: schema.enum(['MALE', 'FEMALE']),
    dob: schema.date({
      format: 'dd-mm-yyyy'
    })
  })

  public async createProfile({ auth, request }) {
    try {
      const user = await auth.use('api').authenticate()

      const { name, mobile, gender, dob } = request.requestBody
      await request.validate({ schema: this.profileSchema })
      const profile = await Profile.create({
        name,
        mobile,
        gender,
        dob,
        user_id: user.id
      })

      return profile
    } catch (err) {
      return err
    }
  }

  public async updateProfile({ auth, request }) {
    try {
      const user = await auth.use('api').authenticate()
      
      const { name, mobile, gender, dob } = request.requestBody
      await request.validate({ schema: this.profileSchema })
      
      // Note: also can use updateOrCreate
      const updatedProfile = await Profile
      .query()
      .where('user_id', user.id)
      .update({
        name,
        mobile,
        gender,
        dob
      })

      return updatedProfile
    } catch (err) {
      return err
    }
  }

  public async getProfile({ auth }) {
    try {
      const user = await auth.use('api').authenticate()
      const result = await User
      .query()
      .select('id', 'email')
      .where('id', user.id)
      .preload('profile', (profileQuery) => {
        profileQuery.select('name', 'mobile', 'gender', 'dob')
      })
      return result
    } catch (err) {
      return err
    }
  }

  public async deleteProfile({ auth }) {
    try {
      const user = await auth.use('api').authenticate()

      const updatedProfile = await Profile
      .query()
      .where('user_id', user.id)
      .delete()

      return updatedProfile
    } catch (err) {
      return err
    }
  }
}
