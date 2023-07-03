const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../../utils')

const callback_data = {
    back: 'admin.ringtones.add_prev.back',
}

function makeButtons(ctx){
    return [
        [{ 
            text: ctx.i18n.t(callback_data.back), 
            callback_data: callback_data.back
        }]
    ]
}

const scene = new BaseScene('admin-home-ringtones-add_prev')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.ringtones.add_prev.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.session.temp_message = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.on('text', async ctx => {
    const prevSec = ctx.message.text
    ctx.session.temp_ringtone.prev = prevSec

    await ctx.deleteMessage()
    await ctx.deleteMessage(ctx.session.temp_message.message_id)
    
    await ctx.scene.enter('admin-home-ringtones-accept')
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.back: {
            await ctx.deleteMessage()
            await ctx.scene.enter('admin-home-ringtones-add_file')
            break
        }
    }
})

module.exports = scene