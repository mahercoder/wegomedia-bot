const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../../utils')

const callback_data = {
    friends_help_btn: 'user.extra_chance.friends_help_btn',
    my_ids_btn: 'user.extra_chance.my_ids_btn',
    back: 'user.extra_chance.back'
}
    
function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.friends_help_btn), callback_data: callback_data.friends_help_btn }],
        [{ text: ctx.i18n.t(callback_data.my_ids_btn), callback_data: callback_data.my_ids_btn }],
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }]
    ]
}

const scene = new BaseScene('user-home-extra_chance')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.extra_chance.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    await ctx.replyWithHTML(caption, { 
        reply_markup: keyboard,
        disable_web_page_preview: true 
    })

    ctx.session.givenScene = false
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.friends_help_btn: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-extra_chance-friends_help')
            break
        }
        case callback_data.my_ids_btn: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-extra_chance-my_ids')
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
    require('./my_ids'),
    require('./friends_help')
]