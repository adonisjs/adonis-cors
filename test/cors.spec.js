'use strict'

/*
 * adonis-cors
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const { Config } = require('@adonisjs/sink')

const Cors = require('../src/Cors')

test.group('Cors', () => {
  test('return true when options.origin is true', (assert) => {
    const config = new Config()
    config.set('cors.origin', true)
    const cors = new Cors(config)
    assert.isTrue(cors._getOrigin('foo'))
  })

  test('return null when options.origin is false', (assert) => {
    const config = new Config()
    const cors = new Cors(config)
    assert.isFalse(cors._getOrigin('foo'))
  })

  test('return options.origin when its a string and allows the current origin', (assert) => {
    const config = new Config()
    config.set('cors.origin', 'bar,baz')
    const cors = new Cors(config)
    assert.equal(cors._getOrigin('bar'), 'bar')
  })

  test('join origins when its an array and allows the current origin', (assert) => {
    const config = new Config()
    config.set('cors.origin', ['bar', 'baz'])
    const cors = new Cors(config)
    assert.equal(cors._getOrigin('bar'), 'bar')
  })

  test('set value to * when a wildcard is defined', (assert) => {
    const config = new Config()
    config.set('cors.origin', '*')
    const cors = new Cors(config)
    assert.equal(cors._getOrigin('foo'), '*')
  })

  test('set false when origin function returns false', (assert) => {
    const config = new Config()
    config.set('cors.origin', function (origin) {
      return origin === 'bar'
    })
    const cors = new Cors(config)
    assert.isFalse(cors._getOrigin('foo'))
  })

  test('set current origin when function returns true', (assert) => {
    const config = new Config()
    config.set('cors.origin', function (origin) {
      return origin === 'foo'
    })
    const cors = new Cors(config)
    assert.equal(cors._getOrigin('foo'), 'foo')
  })

  test('set current origin when regex passes', (assert) => {
    const config = new Config()
    config.set('cors.origin', /[a-z]+\.adonisjs\.com/)
    const cors = new Cors(config)
    assert.equal(cors._getOrigin('edge.adonisjs.com'), 'edge.adonisjs.com')
  })

  test('return current headers when options.headers is true', (assert) => {
    const config = new Config()
    config.set('cors.headers', true)
    const cors = new Cors(config)
    assert.equal(cors._getHeaders('Authorization,Accepts'), 'Authorization,Accepts')
  })

  test('return false when options.headers is false', (assert) => {
    const config = new Config()
    config.set('cors.headers', false)
    const cors = new Cors(config)
    assert.isFalse(cors._getHeaders('foo'))
  })

  test('return options.headers when its a string', (assert) => {
    const config = new Config()
    config.set('cors.headers', 'Authorization')
    const cors = new Cors(config)
    assert.equal(cors._getHeaders('foo'), 'Authorization')
  })

  test('return function value when options.headers is a function', (assert) => {
    const config = new Config()
    config.set('cors.headers', function (headers) {
      return headers === 'Authorization'
    })
    const cors = new Cors(config)
    assert.isFalse(cors._getHeaders('Accepts'))
  })

  test('join headers when its an array', (assert) => {
    const config = new Config()
    config.set('cors.headers', ['Authorization', 'Accepts'])
    const cors = new Cors(config)
    assert.equal(cors._getHeaders('Accepts'), 'Authorization,Accepts')
  })

  test('return current header when its a wildcard', (assert) => {
    const config = new Config()
    config.set('cors.headers', '*')
    const cors = new Cors(config)
    assert.equal(cors._getHeaders('Accepts'), 'Accepts')
  })

  test('set origin', (assert) => {
    const config = new Config()
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setOrigin('foo', response)
    assert.deepEqual(response.headers, { key: 'Access-Control-Allow-Origin', value: false })
  })

  test('set headers', (assert) => {
    const config = new Config()
    config.set('cors.headers', true)
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setHeaders('Authorization', response)
    assert.deepEqual(response.headers, { key: 'Access-Control-Allow-Headers', value: 'Authorization' })
  })

  test('set credentails', (assert) => {
    const config = new Config()
    config.set('cors.credentials', true)
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setCredentials(response)
    assert.deepEqual(response.headers, { key: 'Access-Control-Allow-Credentials', value: true })
  })

  test('do not set header when credentials are false', (assert) => {
    const config = new Config()
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setCredentials(response)
    assert.isNull(response.headers)
  })

  test('do not expose headers when set to false', (assert) => {
    const config = new Config()
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setExposeHeaders(response)
    assert.isNull(response.headers)
  })

  test('define expose headers as an array', (assert) => {
    const config = new Config()
    config.set('cors.exposeHeaders', ['Cache-Control', 'Accept'])
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setExposeHeaders(response)
    assert.deepEqual(response.headers, { key: 'Access-Control-Expose-Headers', value: 'Cache-Control,Accept' })
  })

  test('define expose headers as a string', (assert) => {
    const config = new Config()
    config.set('cors.exposeHeaders', 'Cache-Control')
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setExposeHeaders(response)
    assert.deepEqual(response.headers, { key: 'Access-Control-Expose-Headers', value: 'Cache-Control' })
  })

  test('define default allowed methods', (assert) => {
    const config = new Config()
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setMethods(response)
    assert.deepEqual(response.headers, { key: 'Access-Control-Allow-Methods', value: 'GET,PUT,POST' })
  })

  test('define custom methods', (assert) => {
    const config = new Config()
    config.set('cors.methods', 'POST')
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setMethods(response)
    assert.deepEqual(response.headers, { key: 'Access-Control-Allow-Methods', value: 'POST' })
  })

  test('do not set allow methods header when methods are set to false', (assert) => {
    const config = new Config()
    config.set('cors.methods', false)
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setMethods(response)
    assert.isNull(response.headers)
  })

  test('do not set max age headers when max age is set to false', (assert) => {
    const config = new Config()
    config.set('cors.maxAge', false)
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setMaxAge(response)
    assert.isNull(response.headers)
  })

  test('set max age header', (assert) => {
    const config = new Config()
    const cors = new Cors(config)
    const response = {
      headers: null,
      header (key, value) {
        this.headers = { key, value }
      }
    }
    cors._setMaxAge(response)
    assert.deepEqual(response.headers, { key: 'Access-Control-Max-Age', value: 90 })
  })

  test('do not set specific headers when request is not options', async (assert) => {
    const config = new Config()
    config.set('cors.credentials', true)
    const cors = new Cors(config)

    const response = {
      headers: [],
      header (key, value) {
        this.headers.push({ key, value })
      }
    }

    const request = {
      method () {
        return 'GET'
      },
      header (key) {
        if (key === 'origin') {
          return 'foo'
        }
        if (key === 'access-control-request-headers') {
          return 'Authorization'
        }
      }
    }

    await cors.handle({ request, response }, function () {})
    assert.deepEqual(response.headers, [
      { key: 'Access-Control-Allow-Origin', value: false },
      { key: 'Access-Control-Allow-Credentials', value: true }
    ])
  })

  test('set all cors headers when request is options', async (assert) => {
    const config = new Config()
    config.set('cors.credentials', true)
    const cors = new Cors(config)

    const response = {
      headers: [],
      _status: 200,
      header (key, value) {
        this.headers.push({ key, value })
        return this
      },
      status: function (status) {
        this._status = status
        return this
      },
      send: function () {}
    }

    const request = {
      method () {
        return 'OPTIONS'
      },
      header (key) {
        if (key === 'origin') {
          return 'foo'
        }
        if (key === 'access-control-request-headers') {
          return 'Authorization'
        }
      }
    }

    await cors.handle({ request, response }, function () {})
    assert.deepEqual(response.headers, [
      { key: 'Access-Control-Allow-Origin', value: false },
      { key: 'Access-Control-Allow-Credentials', value: true },
      { key: 'Access-Control-Allow-Methods', value: 'GET,PUT,POST' },
      { key: 'Access-Control-Allow-Headers', value: 'Authorization' },
      { key: 'Access-Control-Max-Age', value: 90 }
    ])
  })

  test('set vary header when options.origin is a string', async (assert) => {
    const config = new Config()
    config.set('cors.origin', 'foo')
    const cors = new Cors(config)

    const response = {
      headers: [],
      header (key, value) {
        this.headers.push({ key, value })
      },
      vary (value) {
        this.headers.push({ key: 'Vary', value })
      }
    }

    const request = {
      method () {
        return 'GET'
      },
      header (key) {
        if (key === 'origin') {
          return 'foo'
        }
        if (key === 'access-control-request-headers') {
          return 'Authorization'
        }
      }
    }

    await cors.handle({ request, response }, function () {})
    assert.deepEqual(response.headers, [
      { key: 'Vary', value: 'Origin' },
      { key: 'Access-Control-Allow-Origin', value: 'foo' }
    ])
  })

  test('set vary header when options.origin is a regex', async (assert) => {
    const config = new Config()
    config.set('cors.origin', /foo/)
    const cors = new Cors(config)

    const response = {
      headers: [],
      header (key, value) {
        this.headers.push({ key, value })
      },
      vary (value) {
        this.headers.push({ key: 'Vary', value })
      }
    }

    const request = {
      method () {
        return 'GET'
      },
      header (key) {
        if (key === 'origin') {
          return 'foo'
        }
        if (key === 'access-control-request-headers') {
          return 'Authorization'
        }
      }
    }

    await cors.handle({ request, response }, function () {})
    assert.deepEqual(response.headers, [
      { key: 'Vary', value: 'Origin' },
      { key: 'Access-Control-Allow-Origin', value: 'foo' }
    ])
  })

  test('set vary header when options.origin is an array', async (assert) => {
    const config = new Config()
    config.set('cors.origin', ['foo'])
    const cors = new Cors(config)

    const response = {
      headers: [],
      header (key, value) {
        this.headers.push({ key, value })
      },
      vary (value) {
        this.headers.push({ key: 'Vary', value })
      }
    }

    const request = {
      method () {
        return 'GET'
      },
      header (key) {
        if (key === 'origin') {
          return 'foo'
        }
        if (key === 'access-control-request-headers') {
          return 'Authorization'
        }
      }
    }

    await cors.handle({ request, response }, function () {})
    assert.deepEqual(response.headers, [
      { key: 'Vary', value: 'Origin' },
      { key: 'Access-Control-Allow-Origin', value: 'foo' }
    ])
  })

  test('do not set vary header when options.origin is *', async (assert) => {
    const config = new Config()
    config.set('cors.origin', '*')
    const cors = new Cors(config)

    const response = {
      headers: [],
      header (key, value) {
        this.headers.push({ key, value })
      },
      vary (value) {
        this.headers.push({ key: 'Vary', value })
      }
    }

    const request = {
      method () {
        return 'GET'
      },
      header (key) {
        if (key === 'origin') {
          return 'foo'
        }
        if (key === 'access-control-request-headers') {
          return 'Authorization'
        }
      }
    }

    await cors.handle({ request, response }, function () {})
    assert.deepEqual(response.headers, [
      { key: 'Access-Control-Allow-Origin', value: '*' }
    ])
  })

  test('do not set vary header when options.origin is true', async (assert) => {
    const config = new Config()
    config.set('cors.origin', true)
    const cors = new Cors(config)

    const response = {
      headers: [],
      header (key, value) {
        this.headers.push({ key, value })
      },
      vary (value) {
        this.headers.push({ key: 'Vary', value })
      }
    }

    const request = {
      method () {
        return 'GET'
      },
      header (key) {
        if (key === 'origin') {
          return 'foo'
        }
        if (key === 'access-control-request-headers') {
          return 'Authorization'
        }
      }
    }

    await cors.handle({ request, response }, function () {})
    assert.deepEqual(response.headers, [
      { key: 'Access-Control-Allow-Origin', value: 'foo' }
    ])
  })

  test('do not set vary header when options.origin is false', async (assert) => {
    const config = new Config()
    config.set('cors.origin', false)
    const cors = new Cors(config)

    const response = {
      headers: [],
      header (key, value) {
        this.headers.push({ key, value })
      },
      vary (value) {
        this.headers.push({ key: 'Vary', value })
      }
    }

    const request = {
      method () {
        return 'GET'
      },
      header (key) {
        if (key === 'origin') {
          return 'foo'
        }
        if (key === 'access-control-request-headers') {
          return 'Authorization'
        }
      }
    }

    await cors.handle({ request, response }, function () {})
    assert.deepEqual(response.headers, [
      { key: 'Access-Control-Allow-Origin', value: false }
    ])
  })

  test('work fine when origin is null', async (assert) => {
    const config = new Config()
    config.set('cors.credentials', true)
    config.set('cors.origin', true)

    const cors = new Cors(config)

    const response = {
      headers: [],
      header (key, value) {
        this.headers.push({ key, value })
      }
    }

    const request = {
      method () {
        return 'GET'
      },
      header (key) {
        if (key === 'access-control-request-headers') {
          return 'Authorization'
        }
      }
    }

    await cors.handle({ request, response }, function () {})
    assert.deepEqual(response.headers, [
      { key: 'Access-Control-Allow-Credentials', value: true }
    ])
  })
})
