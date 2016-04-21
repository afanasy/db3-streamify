var _ = require('underscore')
var stream = require('stream')

module.exports = function (ctx, next) {
  var self = this
  return function (ctx, next) {
    if (_.isFunction(ctx.done))
      return next()
    if (ctx.query) {
      if (_.contains(['insert', 'update', 'delete', 'save', 'duplicate'], ctx.query.name)) {
        return new stream.Writable({
          objectMode: true,
          write: function (data, encoding, next) {
            if (ctx.query.name != 'delete')
              ctx.query.set = data
            else
              ctx.query.where = data
            ctx.db.query(ctx.query, next)
          }
        })
      }
    }
    return next()
  }
}
