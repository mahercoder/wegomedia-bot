const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers, constants } = require('../../../../utils')
const { regions } = constants

const callback_data = {
    item: 'user.signup.get_region',
    back: 'user.signup.get_region.back'
}

function makeButtons(ctx){
    let buttons = []
    const currentRegions = regions[ctx.session.signup_user.district]

    for(let i=0; i < currentRegions.length; i++){
        buttons.push({ text: currentRegions[i].name, callback_data: `${callback_data.item}--${i}`})
    }
    
    buttons = helpers.matrixify(buttons, 2)
    
    buttons.push([{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }])

    return buttons
}

const scene = new BaseScene('user-signup-get_region')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.signup.get_region.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.session.currentSceneMessage = await ctx.replyWithHTML(caption, {
        reply_markup: keyboard,
        disable_web_page_preview: true 
    })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]

    switch(action){
        case callback_data.item: {
            const region = ctx.callbackQuery.data.split('--')[1]
            ctx.session.signup_user.region = parseInt(region)
            
            ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()

            ctx.scene.enter('user-signup-finished')
            break
        }
        case callback_data.back: {
            ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
            ctx.scene.enter('user-signup-get_district')
            break
        }
    }
})

module.exports = scene