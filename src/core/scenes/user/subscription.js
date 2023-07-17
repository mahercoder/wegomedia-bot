const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { Models } = require('../../../models')
const { User } = Models
const { helpers } = require('../../../utils')

const callback_data = {
    subscribed: 'user.subscription.subscribed'
}

async function makeButtons(ctx){
    let buttons = []

    const user = await User.findOne({ where: { id: ctx.from.id }})
    const districtId = user.district
    const regionId = user.region
    
    const partnerChannels = [
        ...helpers.getChannels(),
        ...helpers.getDistrictChannels(districtId),
        ...helpers.getRegionChannels(districtId, regionId)
    ]
    
    for(let i=0; i < partnerChannels.length; i++){
        try{
            const channel = await ctx.telegram.getChat(partnerChannels[i])
            const url = channel.username ? `https://t.me/${channel.username}` : channel.invite_link

            buttons.push([
                { text: channel.title, url: url }
            ]);

        } catch(err){
            if(err.code == 403){
                BotSettigs.removePartnerChannel(i)
            }
        }
    }

    buttons.push([{ text: ctx.i18n.t(callback_data.subscribed), callback_data: callback_data.subscribed }])

    return buttons;
}

const scene = new BaseScene('user-subscription')

scene.enter( async ctx => {
    const user = await User.findOne({ where: { id: ctx.from.id }})
    const districtId = user.district
    const regionId = user.region
    
    const partnerChannels = [
        ...helpers.getChannels(),
        ...helpers.getDistrictChannels(districtId),
        ...helpers.getRegionChannels(districtId, regionId)
    ]

    if(partnerChannels.length > 0){
        const isSubscribed = await helpers.isSubscribed(ctx, partnerChannels)
        if(!isSubscribed){
            const caption = ctx.i18n.t('user.subscription.caption')
            const keyboard = helpers.makeInlineKeyboard(await makeButtons(ctx))
            ctx.session.enteredMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
        } else {
            ctx.scene.enter('user-home')
        }
    } else {
        ctx.scene.enter('user-home')
    }
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]

    switch(action){
        case callback_data.subscribed: {
            await ctx.deleteMessage().catch()

            const user = await User.findOne({ where: { id: ctx.from.id }})
            const districtId = user.district
            const regionId = user.region
            
            const partnerChannels = [
                ...helpers.getChannels(),
                ...helpers.getDistrictChannels(districtId),
                ...helpers.getRegionChannels(districtId, regionId)
            ]

            const isSubscribed = await helpers.isSubscribed(ctx, partnerChannels);

            if(isSubscribed){
                ctx.scene.enter('user-home')
            } else {
                ctx.scene.reenter()
            }
            
            break
        }
    }
})

module.exports = scene