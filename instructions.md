## Register provider

Start by registering the provider inside `start/app.js` file.

```js
const providers = [
  '@adonisjs/cors/providers/CorsProvider'
]
```


## Register middleware

The next thing is to register the middleware globally. Make sure `Cors` middleware is the first middleware in the stack.

The middleware is registered inside `start/kernel.js` file.

```js
const globalMiddleware = [
  'Adonis/Middleware/Cors'
]
```

## Config

The config file has been saved inside `config/cors.js` file. Feel free to tweak it accordingly.
