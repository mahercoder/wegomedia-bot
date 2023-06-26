const { config, helpers } = require('../../utils')

module.exports = {
    name: `setringc`,
    action:
    async function(ctx){        
        if(config.isAdmin(ctx.from.id)){
            const text = ctx.message.text
            const newRingtoneCost = helpers.extractNumberFromCommand('/setringc', text)
            config.setRingtoneCost(newRingtoneCost)
            await ctx.replyWithHTML(ctx.i18n.t('admin.change_costs.ringtone_cost_changed', { 
                ringtoneCost: newRingtoneCost 
            }))
        }
    }
}