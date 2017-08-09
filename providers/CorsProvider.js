'use strict'

/*
 * adonis-cors
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')

class CorsProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Middleware/Cors', (app) => {
      const Cors = require('../src/Cors')
      return new Cors(app.use('Adonis/Src/Config'))
    })
  }
}

module.exports = CorsProvider
