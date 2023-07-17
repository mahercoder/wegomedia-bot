const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../../utils')
const { Models } = require('../../../../models')
const { Id } = Models

const callback_data = {
    friends_help_btn: 'user.extra_chance.my_ids.friends_help_btn',
    back: 'user.extra_chance.my_ids.back'
}
    
function makeButtons(ctx){
    return [
        [{ 
            text: ctx.i18n.t(callback_data.friends_help_btn), 
            callback_data: callback_data.friends_help_btn
        }],
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }]
    ]
}

const scene = new BaseScene('user-home-extra_chance-my_ids')

scene.enter( async ctx => {
    let userIds = []
    const ids = await Id.findAll({ where: { userId: ctx.from.id } })

    for(let i=0; i < ids.length; i++){
        userIds.push(ids[i].id)
    }

    let myIds = '\n'
    
    for(let i=0; i < userIds.length; i++){
        myIds += `\n${i+1}) <b>${userIds[i]}</b>`
    }
    
    const caption = ctx.i18n.t('user.extra_chance.my_ids.caption',{ myIds })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.replyWithHTML(caption, { 
        reply_markup: keyboard,
        disable_web_page_preview: true 
    })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.friends_help_btn: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-extra_chance-friends_help')
            break
        }
        case callback_data.back: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home-extra_chance')
            break
        }
    }
})

module.exports = scene