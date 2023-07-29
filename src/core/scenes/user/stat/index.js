const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../../utils')
const { Models } = require('../../../../models')
const { User } = Models

const callback_data = {
    rating: 'user.stat.rating',
    back: 'user.stat.back'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.rating), callback_data: callback_data.rating }],
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }]
    ]
}

const scene = new BaseScene('user-home-stat')

scene.enter( async ctx => {
    const userCount = await User.count()
    const caption = ctx.i18n.t('user.stat.caption', { userCount })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.rating: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-stat-rating')
            break
        }
        case callback_data.back: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home')
            break
        }
    }
})

module.exports = [
    scene,
    require('./rating')
]