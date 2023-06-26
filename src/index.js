// const localtunnel = require('localtunnel')
const { sequelize } = require('./models')
const { logger } = require('./utils')
const {
    bot, 
    setupCommands, 
    setupMiddlewares, 
    setupUpdates 
} = require('./core')

// const port = 3000
// localtunnel({ port })
// .then( async (tunnel) => {
    try{
        setupMiddlewares(bot)
        setupCommands(bot)
        setupUpdates(bot)
    
        // const url = tunnel.url
        // bot.telegram.setWebhook(`${url}/bot`)
        // bot.startWebhook(`/bot`, null, port)
        
        console.log('Bot is up and running!')
        bot.launch({ dropPendingUpdates: true })
    }catch(err){
        logger.error("Starting bot failed!", { message: err.message })
    }
// })
// .catch(err => logger.error('Problem with localtunnel', { message: err.message }))

// Enable graceful stop
process.once('SIGINT', () => {
    const reason = 'SIGINT event is fired!'
    logger.error(reason)
    sequelize.close()
        .then( () => logger.info(`Database connection successfully closed.`))
    bot.stop(reason)
});

process.once('SIGTERM', () => {
    const reason = 'SIGTERM event is fired!'
    logger.error(reason)
    sequelize.close()
        .then( () => logger.info(`Database connection successfully closed.`))
    bot.stop(reason)
})