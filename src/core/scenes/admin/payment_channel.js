const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { config, helpers } = require('../../../utils');

const callback_data = {
    back: 'admin.payment_channel.back'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }],
    ]
}

const scene = new BaseScene('admin-home-payment_channel');

scene.enter( async ctx => {
    let channelTitle = "Mavjud emas..."
    const paymentChannelId = config.getPaymentChannelId()
    if(paymentChannelId){
        const chat = await ctx.telegram.getChat(paymentChannelId)
        channelTitle = chat.title
    }
    
    const caption = ctx.i18n.t('admin.payment_channel.caption', { channelTitle })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
    ctx.session.tempMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard });
})

scene.on('text', async ctx => {
    try{
        const { forward_from_chat } = ctx.message

        if (forward_from_chat) {
            const paymentChannelId = forward_from_chat.id
            const isBotAdminInThisChannel = await config.isBotAdminInThisChannel(ctx, paymentChannelId)
            
            if(isBotAdminInThisChannel){
                config.setPaymentChannelId(paymentChannelId)
                await ctx.deleteMessage()
                await ctx.deleteMessage(ctx.session.tempMessage.message_id)

                const channelAddedText = ctx.i18n.t('admin.payment_channel.added')
                await ctx.replyWithHTML(channelAddedText)

                await ctx.scene.enter('admin-home')
            } else{
                const botNotFoundText = ctx.i18n.t('admin.payment_channel.bot_not_found')
                await ctx.deleteMessage()
                await ctx.deleteMessage(ctx.session.tempMessage.message_id)
                await ctx.replyWithHTML(botNotFoundText)
                await ctx.scene.reenter()
            }
        } else {
            const notForwardedText = ctx.i18n.t('admin.payment_channel.not_forwarded')
            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.tempMessage.message_id)
            await ctx.replyWithHTML(notForwardedText)
            await ctx.scene.reenter()
        }
    }catch(err){
        console.log(err)
    }
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.back: {
            ctx.deleteMessage().catch();
            ctx.scene.enter('admin-home');
            break;
        }
    }
});

module.exports = scene;