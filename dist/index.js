
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./crypto-api-keys-lib.cjs.production.min.js')
} else {
  module.exports = require('./crypto-api-keys-lib.cjs.development.js')
}
