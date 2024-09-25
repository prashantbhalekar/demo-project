import Route from '@ioc:Adonis/Core/Route'

Route.post('/user/profile', 'ProfileController.createProfile')
Route.put('/user/profile', 'ProfileController.updateProfile')
Route.get('/user/profile', 'ProfileController.getProfile')
Route.delete('/user/profile', 'ProfileController.deleteProfile')
