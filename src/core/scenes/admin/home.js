const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { Models } = require('../../../models')
const { User } = Models
const { helpers } = require('../../../utils')

const callback_data = {
    journal: 'admin.home.journal',
    partner_channel: 'admin.home.partner_channel',
    publish_ad: 'admin.home.publish_ad',
    stats: 'admin.home.stats',
    exit: 'admin.home.exit'
}

function makeButtons(ctx){
    return [
        [ 
            { text: ctx.i18n.t(callback_data.journal), callback_data: callback_data.journal },
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
        case callback_data.journal: {
            ctx.deleteMessage()
            ctx.scene.enter('admin-home-journal')
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