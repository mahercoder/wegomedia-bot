const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { constants, helpers } = require('../../../../utils')

const callback_data = {
    search: 'admin.ringtones.buttons.search',
    add: 'admin.ringtones.buttons.add',
    del: 'admin.ringtones.buttons.del',
    back: 'admin.ringtones.buttons.back'
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.search), switch_inline_query_current_chat: constants.SEARCH_KEY_RINGTONES },
            { text: ctx.i18n.t(callback_data.add), callback_data: callback_data.add }
        ],
        [
            { text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }
        ]
    ]
}

const scene = new BaseScene('admin-home-ringtones')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.ringtones.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.add: {
            await ctx.deleteMessage()
            await ctx.scene.enter('admin-home-ringtones-add_name')
            break
        }
        case callback_data.back: {
            await ctx.deleteMessage()
            await ctx.scene.enter('admin-home')
            break
        }
    }
})

module.exports = [
    scene,
    require('./add_name'),
    require('./add_file'),
    require('./add_prev'),
    require('./accept')
]