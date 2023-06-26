const { config, helpers } = require('../../utils')

module.exports = {
    name: `setrefc`,
    action:
    async function(ctx){        
        if(config.isAdmin(ctx.from.id)){
            const text = ctx.message.text
            const newVoteCost = helpers.extractNumberFromCommand('/setrefc', text)
            config.setReferalCost(newVoteCost)
            await ctx.replyWithHTML(ctx.i18n.t('admin.change_costs.referal_cost_changed', { 
                voteCost: newVoteCost 
            }))
        }
    }
}