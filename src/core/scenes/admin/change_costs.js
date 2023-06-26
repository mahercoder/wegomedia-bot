const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { config, helpers } = require('../../../utils')

const callback_data = {
    change: 'admin.change_costs.change',
    back: 'admin.change_costs.back'
}

function makeButtons(ctx){
    return [
        [ { text: ctx.i18n.t(callback_data.change), callback_data: callback_data.change }],
        [ { text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back } ]
    ]
}

const scene = new BaseScene('admin-home-change_costs')

scene.enter( async ctx => {
    const ringtoneCost = config.getRingtoneCost()
    const referalCost = config.getReferalCost()
    const isWithdrawable = config.getWithdrawability() ? "Mumkin!" : "Mumkin emas!"

    const caption = ctx.i18n.t('admin.change_costs.caption', { 
        ringtoneCost, referalCost, isWithdrawable 
    })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.session.tempMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.change: {
            await ctx.deleteMessage()
            await ctx.replyWithHTML(ctx.i18n.t('admin.change_costs.change_text'))
            await ctx.scene.enter('admin-home')
            break
        }
        case callback_data.back: {
            try{
                await ctx.deleteMessage()
                await ctx.scene.enter('admin-home')
            }catch(err){
                console.log(err)
            }
            break
        }
    }
})

module.exports = scene