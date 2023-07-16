const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../utils')

const callback_data = {
    read_article: 'user.guide.read_article',
    article_link: 'user.guide.article_link',
    back: 'user.guide.back'
}
    
function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.read_article), url: ctx.i18n.t(callback_data.article_link) }],
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }]
    ]
}

const scene = new BaseScene('user-home-guide')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.guide.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.replyWithHTML(caption, { 
        reply_markup: keyboard,
        disable_web_page_preview: true 
    })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.back: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home')
            break
        }
    }
})

module.exports = scene