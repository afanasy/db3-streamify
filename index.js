var _ = require('underscore')
var stream = require('stream')

module.exports = function (ctx, next) {
  var self = this
  return function (ctx, next) {
    if (_.isFunction(ctx.done))
      return next()
    if (ctx.sql) {
      if (_.contains(['insert', 'update', 'delete'], ctx.sql.name)) {
        return new stream.Writable({
          objectMode: true,
          write: function (data, encoding, next) {
            if (ctx.sql.name != 'delete')
              ctx.sql.set = data
            else
              ctx.sql.where = data
            ctx.db.query(ctx.sql, next)
          }
        })
      }
    }
    return next()
  }
}
