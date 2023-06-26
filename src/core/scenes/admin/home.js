const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { Models } = require('../../../models')
const { User } = Models
const { helpers } = require('../../../utils')

const callback_data = {
    ringtones: 'admin.home.ringtones',
    change_costs: 'admin.home.change_costs',
    payment_channel: 'admin.home.payment_channel',
    partner_channel: 'admin.home.partner_channel',
    publish_ad: 'admin.home.publish_ad',
    stats: 'admin.home.stats',
    exit: 'admin.home.exit'
}

function makeButtons(ctx){
    return [
        [ 
            { text: ctx.i18n.t(callback_data.ringtones), callback_data: callback_data.ringtones },
            { text: ctx.i18n.t(callback_data.change_costs), callback_data: callback_data.change_costs }
        ],
        [
            { text: ctx.i18n.t(callback_data.payment_channel), callback_data: callback_data.payment_channel },
            { text: ctx.i18n.t(callback_data.partner_channel), callback_data: callback_data.partner_channel }
        ],
        [   
            { text: ctx.i18n.t(callback_data.publish_ad), callback_data: callback_data.publish_ad },         
            { text: ctx.i18n.t(callback_data.stats), callback_data: callback_data.stats }
        ],
        [ { text: ctx.i18n.t(callback_data.exit), callback_data: callback_data.exit } ]
    ]
}

const scene = new BaseScene('admin-home')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.home.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.reply(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.ringtones: {
            ctx.deleteMessage()
            ctx.scene.enter('admin-home-ringtones')
            break
        }
        case callback_data.change_costs: {
            ctx.deleteMessage()
            ctx.scene.enter('admin-home-change_costs')
            break
        }
        case callback_data.payment_channel: {
            ctx.deleteMessage()
            ctx.scene.enter('admin-home-payment_channel')
            break
        }
        case callback_data.partner_channel: {
            ctx.deleteMessage()
            ctx.scene.enter('admin-home-partner_channel')
            break
        }
        case callback_data.publish_ad: {
            ctx.deleteMessage()
            ctx.scene.enter('admin-home-publish_ad')
            break
        }
        case callback_data.stats: {
            const userCount = await User.count()
            await ctx.deleteMessage()
            const userCountCaption = ctx.i18n.t('admin.stats.caption', { userCount })
            await ctx.replyWithHTML(userCountCaption)
            await ctx.scene.reenter()
            break
        }
        case callback_data.exit: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home')
            break
        }
    }
})

module.exports = scene