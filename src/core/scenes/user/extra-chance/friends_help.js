const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../../utils')

const callback_data = {
    send_friends: 'user.extra_chance.friends_help.send_friends',
    back: 'user.extra_chance.friends_help.back'
}

function makeButtons(ctx){
    return [
        [{
            text: ctx.i18n.t(callback_data.send_friends), 
            switch_inline_query_chosen_chat: {
                query: 'referal',
                allow_user_chats: true,
                allow_bot_chats: false,
                allow_group_chats: true,
                allow_channel_chats: true
            }
        }],
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }]
    ]
}

const scene = new BaseScene('user-home-extra_chance-friends_help')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.extra_chance.friends_help.caption', {
        username: ctx.from.username ? '@'+ctx.from.username : ctx.from.first_name,
        referalLink: `https://t.me/${ctx.botInfo.username}?start=${ctx.from.id}`
    })
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
            ctx.scene.enter('user-home-extra_chance')
            break
        }
    }
})

module.exports = scene