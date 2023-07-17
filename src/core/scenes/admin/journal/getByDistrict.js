const fs = require('fs')
const path = require('path')
const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers, constants } = require('../../../../utils')
const { Models } = require('../../../../models')
const { Id, User } = Models
const { districts, regions } = constants

const callback_data = {
    item: 'admin.journal.get_by_district.item',
    get_all: 'admin.journal.get_by_district.get_all',
    back: 'admin.journal.get_by_district.back'
}

function makeButtons(ctx){
    let buttons = []

    const currentRegions = regions[ctx.session.districtId]

    for(let i=0; i < currentRegions.length; i++){
        buttons.push({ text: currentRegions[i].name, callback_data: `${callback_data.item}--${i}`})
    }
    
    buttons = helpers.matrixify(buttons, 2)
    
    buttons.push([{ text: ctx.i18n.t(callback_data.get_all), callback_data: callback_data.get_all }])

    buttons.push([{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back } ])

    return buttons
}

const scene = new BaseScene('admin-home-journal-get_by_district')

scene.enter( async ctx => {
    const districtName = districts[ctx.session.districtId].name
    const caption = ctx.i18n.t('admin.journal.get_by_district.caption', {
        districtName
    })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.reply(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]
    switch(action){
        case callback_data.item: {
            const regionId = ctx.callbackQuery.data.split('--')[1]
            ctx.session.regionId = parseInt(regionId)
            ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home-journal-get_by_region')
            break
        }
        case callback_data.get_all: {
            await ctx.deleteMessage().catch()
            const filePath = path.join(__dirname, '../../../..', '/cache/userList.xlsx')
            const userList = await helpers.makeUsers(Id, User, ctx.session.districtId)
            if(userList.length > 0){
                await helpers.makeUserList(userList, filePath)
                await ctx.telegram.sendDocument(ctx.from.id, { source: filePath })
                fs.unlinkSync(filePath)
            } else {
                await ctx.reply("Ushbu hudud bo'yicha hech qanday foydalanuvchilar mavjud emas!")
            }
            ctx.scene.reenter()
            break
        }
        case callback_data.back: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home-journal')
            break
        }
    }
})

module.exports = scene
