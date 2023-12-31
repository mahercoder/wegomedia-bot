const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../../utils')

const callback_data = {
    phone: 'user.signup.get_phone.phone'
}

function makeButtons(ctx){
    return {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
            [{ text: ctx.i18n.t(callback_data.phone), request_contact: true }]
        ]
    }
}

const scene = new BaseScene('user-signup-get_phone')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.signup.get_phone.caption')
    const keyboard = makeButtons(ctx)
    ctx.session.currentSceneMessage = await ctx.replyWithHTML(caption, {
        reply_markup: keyboard,
        disable_web_page_preview: true 
    })
})

scene.on('contact', async ctx => {
    let phone = ctx.message.contact.phone_number

    if(ctx.message.contact.user_id === ctx.from.id){
        // Jo'natilgan raqamda "+" mavjud bo'lmasa:
        if(phone.split('+').length == 1){
            phone = '+' + phone
        }

        if(phone.startsWith('+998', 0)){
            ctx.session.signup_user.phone = phone

            ctx.deleteMessage().catch()
            ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()

            ctx.scene.enter('user-signup-get_district')
        } else {
            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
            await ctx.reply("Kechirasiz, botdan faqat +998 bilan boshlanuvchi raqamlar foydala oladi!")
            await ctx.scene.reenter()
        }
    } else {
        await ctx.deleteMessage()
        await ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
        await ctx.reply("Kechirasiz, telegram raqamingizni yuboring.")
        await ctx.scene.reenter()
    }
})

module.exports = scene


// reply_markup: {
//     one_time_keyboard: true,
//     resize_keyboard: true,
//     keyboard: [[{ text: myPhoneBtn, request_contact: true }]]
// }