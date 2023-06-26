const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../utils')

const callback_data = {
    ringtones: 'user.home.ringtones',
    images: 'user.home.images',
    balance: 'user.home.balance',
    feedback: 'user.home.feedback',
    about: 'user.home.about',
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.ringtones), callback_data: callback_data.ringtones }, 
            { text: ctx.i18n.t(callback_data.images), callback_data: callback_data.images }
        ],
        [
            { text: ctx.i18n.t(callback_data.balance), callback_data: callback_data.balance }, 
            { text: ctx.i18n.t(callback_data.feedback), callback_data: callback_data.feedback }
        ],
        [{ text: ctx.i18n.t(callback_data.about), callback_data: callback_data.about } ]
    ]
}

const scene = new BaseScene('user-home')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.home.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.reply(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.ringtones: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-ringtones')
            break
        }
        case callback_data.images: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-images')
            break
        }
        case callback_data.balance: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-balance')
            break
        }
        case callback_data.feedback: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-feedback')
            break
        }
        case callback_data.about: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-about')
            break
        }
    }
})

module.exports = scene