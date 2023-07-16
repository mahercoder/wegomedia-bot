const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { helpers } = require('../../../../utils');

const callback_data = {
    selected_region: 'admin.partner_channel.region_channels.item',
    back: 'admin.partner_channel.region_channels.back',
}

function makeButtons(ctx){
    let buttons = [];

    const districtId = ctx.session.selected_district.id
    const regions = helpers.getRegions(districtId)
    
    for(let i=0; i < regions.length; i++){
        try{
            const regionName = regions[i].name

            buttons.push(
                { text: regionName, callback_data: `${callback_data.selected_region}--${i}` }
            )

        } catch(err){}
    }
    buttons = helpers.matrixify(buttons, 2);
    buttons.push([{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }])

    return buttons
}

const scene = new BaseScene('admin-home-partner_channel-region_channels')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.partner_channel.region_channels.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
    ctx.session.enteredMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]

    switch(action){
        case callback_data.selected_region: {
            await ctx.deleteMessage().catch()
            const districtId = ctx.session.selected_district.id
            const regionIndex = +ctx.callbackQuery.data.split('--')[1]
            ctx.session.selected_region = helpers.getRegions(districtId)[regionIndex]
            ctx.scene.enter('admin-home-partner_channel-selected_region')
            break
        }
        case callback_data.back: {
            await ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home-partner_channel-selected_district')
            break
        }
    }
})

module.exports = scene;