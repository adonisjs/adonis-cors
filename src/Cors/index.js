'use strict'

/*
 * adonis-cors
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const defaultConfig = require('../../example/cors.js')

/**
 * Cors class to work as a middleware and set CORS headers
 * based upon configurations saved inside `config/cors.js`
 * file.
 *
 * @namespace Adonis/Middleware/Cors
 *
 * @class Cors
 * @constructor
 */
class Cors {
  constructor (Config) {
    this.options = Config.merge('cors', defaultConfig)
  }

  /**
   * Returns the origin to be allowed for CORS
   *
   * @method _getOrigin
   *
   * @param  {String}   origin
   *
   * @return {String}
   *
   * @private
   */
  _getOrigin (origin) {
    const allowedOrigins = typeof (this.options.origin) === 'function'
    ? this.options.origin(origin)
    : this.options.origin

    /**
     * We allow the current origin when allowedOrigins is a boolean
     * returning true.
     */
    return allowedOrigins === true || allowedOrigins === '*'
    ? '*'
    : (allowedOrigins instanceof Array === true ? allowedOrigins.join(',') : allowedOrigins)
  }

  /**
   * The list of headers to be allowed for CORS request
   *
   * @method _getHeaders
   *
   * @param  {String}    headers
   *
   * @return {String}
   *
   * @private
   */
  _getHeaders (headers) {
    const allowedHeaders = typeof (this.options.headers) === 'function'
    ? this.options.headers(headers)
    : this.options.headers

    /**
     * We allow the current headers when allowedHeaders is a boolean
     * returning true.
     */
    return allowedHeaders === true || allowedHeaders === '*'
    ? headers
    : (allowedHeaders instanceof Array === true ? allowedHeaders.join(',') : allowedHeaders)
  }

  /**
   * Sets the `Access-Control-Allow-Origin` header
   *
   * @method _setOrigin
   *
   * @param  {String}   origin
   * @param  {Object} response
   *
   * @private
   */
  _setOrigin (origin, response) {
    response.header('Access-Control-Allow-Origin', this._getOrigin(origin))
    return this
  }

  /**
   * Sets `Access-Control-Allow-Credentials` header only when
   * `credentials=true` inside the config file.
   *
   * @method _setCredentials
   *
   * @param {Object} response
   *
   * @private
   */
  _setCredentials (response) {
    if (this.options.credentials === true) {
      response.header('Access-Control-Allow-Credentials', this.options.credentials)
    }
    return this
  }

  /**
   * Set `Access-Control-Expose-Headers` header only when it is
   * defined inside the config file.
   *
   * @method _setExposeHeaders
   *
   * @param  {Object}          response
   *
   * @private
   */
  _setExposeHeaders (response) {
    const exposeHeaders = this.options.exposeHeaders instanceof Array === true
    ? this.options.exposeHeaders.join(',')
    : this.options.exposeHeaders

    if (typeof (exposeHeaders) === 'string' && exposeHeaders.trim()) {
      response.header('Access-Control-Expose-Headers', exposeHeaders)
    }
    return this
  }

  /**
   * Set `Access-Control-Allow-Methods` header only when
   * `methods` are defined in the config file.
   *
   * @method _setMethods
   *
   * @param  {Object}    response
   *
   * @private
   */
  _setMethods (response) {
    const methods = this.options.methods instanceof Array === true
    ? this.options.methods.join(',')
    : this.options.methods

    if (typeof (methods) === 'string' && methods.trim()) {
      response.header('Access-Control-Allow-Methods', methods)
    }
    return this
  }

  /**
   * Set `Access-Control-Allow-Headers` header only when headers
   * are defined inside the config file.
   *
   * @method _setHeaders
   *
   * @param  {String}    headers
   * @param  {Object}    response
   *
   * @private
   */
  _setHeaders (headers, response) {
    const corsHeaders = this._getHeaders(headers)
    if (corsHeaders) {
      response.header('Access-Control-Allow-Headers', corsHeaders)
    }
    return this
  }

  /**
   * Set `Access-Control-Allow-Max-Age` header only when `maxAge`
   * is defined inside the config file.
   *
   * @method _setMaxAge
   *
   * @param {Object} response
   *
   * @private
   */
  _setMaxAge (response) {
    if (this.options.maxAge) {
      response.header('Access-Control-Allow-Max-Age', this.options.maxAge)
    }
    return this
  }

  /**
   * Handle the request and respond for OPTIONS request
   *
   * @method handle
   *
   * @param  {Object}   options.request
   * @param  {Object}   options.response
   * @param  {Function} next
   *
   * @return {void}
   */
  async handle ({ request, response }, next) {
    this
      ._setOrigin(request.header('origin'), response)
      ._setCredentials(response)
      ._setExposeHeaders(response)

    /**
     * If request is not for OPTIONS call next. Otherwise set
     * CORS headers.
     */
    if (request.method() !== 'OPTIONS') {
      await next()
      return
    }

    this
      ._setMethods(response)
      ._setHeaders(request.header('access-control-request-headers'), response)
      ._setMaxAge(response)

    response.header('Content-length', 0).status(204).send('')
  }
}

module.exports = Cors
