const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../../utils')

const callback_data = {
    back: 'user.signup.get_name.back'
}
    
function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }]
    ]
}

const scene = new BaseScene('user-signup-get_name')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.signup.get_name.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.session.currentSceneMessage = await ctx.replyWithHTML(caption, { 
        reply_markup: keyboard,
        disable_web_page_preview: true 
    })
})

scene.on('text', async ctx => {
    ctx.session.signup_user.fullname = ctx.from.first_name
    
    ctx.deleteMessage().catch()
    ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
    
    ctx.scene.enter('user-signup-get_phone')
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.back: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-signup-get_name')
            break
        }
    }
})

module.exports = scene