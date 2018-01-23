'use strict'

/*
 * adonis-auth
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')

module.exports = async function (cli) {
  try {
    await cli.copy(
      path.join(__dirname, './config/cors.js'),
      path.join(cli.helpers.configPath(), 'cors.js')
    )
    cli.command.completed('create', 'config/cors.js')
  } catch (error) {
    // ignore error
  }
}
