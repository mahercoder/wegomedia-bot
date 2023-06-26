const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { Models } = require('../../../models')
const { User } = Models
const { helpers } = require('../../../utils');

const callback_data = {
    no: 'admin.publish_ad.no',
    yes: 'admin.publish_ad.yes',
    back: 'admin.publish_ad.back'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }],
    ]
}

function makeVerifyInlineKeyboard(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.no), callback_data: callback_data.no },
            { text: ctx.i18n.t(callback_data.yes), callback_data: callback_data.yes }
        ]
    ]
}

async function broadcast(ctx){
    let receiverCount = 0
    let stopperCount = 0

    const users = await User.findAll()

    for(let i=0; i < users.length; i++){
        try{
            await ctx.telegram.copyMessage(
                users[i].id, 
                ctx.from.id, 
                ctx.session.adMsgAgreement.message_id,
                { parse_mode: 'HTML', reply_markup: ctx.session.adKeyboard }
            )

            receiverCount++
        }catch(err){
            // Forbidden: bot was blocked by the user
            if(err.error_code == 403){
                stopperCount++ 
            }
        }
    }

    return {
        userCount: users.length, receiverCount, stopperCount
    }
}

const scene = new BaseScene('admin-home-publish_ad');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.publish_ad.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.session.tempMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.on('message', async ctx => {
    ctx.session.adMsg = ctx.message
    
    const caption = ctx.i18n.t('admin.publish_ad.agreement')
    const keyboard = helpers.makeInlineKeyboard(makeVerifyInlineKeyboard(ctx))

    await ctx.deleteMessage(ctx.session.tempMessage.message_id)
    ctx.session.tempMessage = null

    ctx.session.adKeyboard = ctx.message.reply_markup
    ctx.session.adMsgAgreement = await ctx.telegram.copyMessage(
        ctx.chat.id, 
        ctx.from.id, 
        ctx.session.adMsg.message_id,
        { parse_mode: 'HTML', reply_markup: ctx.message.reply_markup }
    )

    await ctx.deleteMessage(ctx.session.adMsg.message_id)

    // Verification Form!
    ctx.session.tempMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.yes: {
            await ctx.deleteMessage(ctx.session.tempMessage.message_id)

            try {
                await ctx.replyWithHTML(ctx.i18n.t('admin.publish_ad.started'))
                const { userCount, receiverCount, stopperCount } = await broadcast(ctx)
                await ctx.replyWithHTML(ctx.i18n.t('admin.publish_ad.ended'))
                
                await ctx.replyWithHTML(ctx.i18n.t('admin.publish_ad.report', {
                    userCount, receiverCount, stopperCount
                }))
                
                ctx.scene.enter('admin-home')
            } catch (error) {
                console.log(error)   
            }

            break;
        }
        case callback_data.no: {
            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.adMsgAgreement.message_id)
            ctx.session.adMsgAgreement = null
            ctx.scene.enter('admin-home')
            break;
        }
        case callback_data.back: {
            await ctx.deleteMessage()
            
            if(ctx.session.adMsgAgreement){
                await ctx.deleteMessage(ctx.session.adMsgAgreement.message_id)
            }
            ctx.scene.enter('admin-home');
            break;
        }
    }
});

module.exports = scene;