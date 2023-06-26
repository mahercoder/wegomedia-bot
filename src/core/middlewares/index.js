const report = require('./report')
const i18n = require('./i18n')
const stage = require('./stage')
const session  = require('./session')
const uzbekMovies = require('./uzbekMovies')
// const isAuth = require('./isAuth')

module.exports = async bot => {
    bot.use(session)
    bot.use(i18n)
    bot.use(stage)
    bot.use(uzbekMovies)
    // bot.use(isAuth)
    bot.catch(report)
}