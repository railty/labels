'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.get('docs', 'DocController.index')
Route.post('docs', 'DocController.save')
Route.get('docs/:id', 'DocController.show')
Route.put('docs/:id', 'DocController.edit')
Route.get('docs/:id/delete', 'DocController.delete')

Route.get('docs/:id/edit', 'DocController.edit')
Route.get('docs/:id/edit2', 'DocController.edit2')
Route.get('docs/:id/edit3', 'DocController.edit3')
Route.post('docs/:id/save', 'DocController.save2')

Route.post('s2p', 'DocController.s2p')

Route.get('code/:text\.:format', 'CodeController.create')
