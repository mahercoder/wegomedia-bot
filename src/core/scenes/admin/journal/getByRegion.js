const fs = require('fs')
const path = require('path')
const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers, constants } = require('../../../../utils')
const { Models } = require('../../../../models')
const { Id, User } = Models
const { regions } = constants

const callback_data = {
    get_all: 'admin.journal.get_by_region.get_all',
    back: 'admin.journal.get_by_region.back'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.get_all), callback_data: callback_data.get_all }],
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back } ]
    ]
}

const scene = new BaseScene('admin-home-journal-get_by_region')

scene.enter( async ctx => {
    const regionName = regions[ctx.session.districtId][ctx.session.regionId].name
    const caption = ctx.i18n.t('admin.journal.get_by_region.caption', {
        regionName
    })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.reply(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]
    switch(action){
        case callback_data.get_all: {
            await ctx.deleteMessage().catch()
            const filePath = path.join(__dirname, '../../../..', '/temp/userList.xlsx')
            const userList = await helpers.makeUsers(Id, User, ctx.session.districtId, ctx.session.regionId)
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
            ctx.scene.enter('admin-home-journal-get_by_district')
            break
        }
    }
})

module.exports = scene
