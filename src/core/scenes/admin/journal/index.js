const fs = require('fs')
const path = require('path')
const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers, constants } = require('../../../../utils')
const { Models } = require('../../../../models')
const { Id, User } = Models
const { districts } = constants

const callback_data = {
    item: 'admin.journal.item',
    get_all: 'admin.journal.buttons.get_all',
    back: 'admin.journal.buttons.back'
}

function makeButtons(ctx){
    let buttons = []

    for(let i=0; i < districts.length; i++){
        buttons.push({ text: districts[i].name, callback_data: `${callback_data.item}--${i}`})
    }

    buttons = helpers.matrixify(buttons, 2)
    buttons.push([{ text: ctx.i18n.t(callback_data.get_all), callback_data: callback_data.get_all }])
    buttons.push([{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back } ])

    return buttons
}

const scene = new BaseScene('admin-home-journal')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.journal.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.reply(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]
    switch(action){
        case callback_data.item: {
            const districtId = ctx.callbackQuery.data.split('--')[1]
            ctx.session.districtId = parseInt(districtId)
            ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home-journal-get_by_district')
            break
        }
        case callback_data.get_all: {
            await ctx.deleteMessage().catch()
            const filePath = path.join(__dirname, '../../../..', '/cache/userList.xlsx')
            const userList = await helpers.makeUsers(Id, User)
            if(userList.length > 0){
                await helpers.makeUserList(userList, filePath)
                await ctx.telegram.sendDocument(ctx.from.id, { source: filePath })
                fs.unlinkSync(filePath)
            } else {
                await ctx.reply("Hech qanday foydalanuvchilar mavjud emas!")
            }
            ctx.scene.reenter()
            break
        }
        case callback_data.back: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home')
            break
        }
    }
})

module.exports = [
    scene,
    require('./getByDistrict'),
    require('./getByRegion')
]