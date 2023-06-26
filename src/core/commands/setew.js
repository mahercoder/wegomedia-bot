const { config, helpers } = require('../../utils')

module.exports = {
    name: `setew`,
    action:
    async function(ctx){        
        if(config.isAdmin(ctx.from.id)){
            config.setWithdrawabality(!config.getWithdrawability())
            await ctx.replyWithHTML(ctx.i18n.t('admin.change_costs.min_with_cost_changed', { 
                isWithdrawable: config.getWithdrawability() ? "Mumkin!" : "Mumkin emas!"
            }))
        }
    }
}