const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../../utils')
const { Models } = require('../../../../models')
const { User } = Models

const callback_data = {
    update: 'user.stat.update',
    back: 'user.stat.back'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.update), callback_data: callback_data.update }],
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }]
    ]
}

async function makeRating(){
    let caption = ''
    const medals = ['🥇', '🥈', '🥉', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅']
    const users = await User.findAll({
        order: [['referals', 'DESC']],
        limit: 10,
    })

    for(let i=0; i < users.length; i++){
        caption += `${i+1}. ${users[i].fullname} — ${helpers.strToArr(users[i].referals).length} ${medals[i]}\n`
    }

    return caption
}

const scene = new BaseScene('user-home-stat-rating')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.stat.rating_caption') + (await makeRating())
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.update: {
            await ctx.deleteMessage().catch()
            await ctx.scene.reenter()
            break
        }
        case callback_data.back: {
            await ctx.deleteMessage().catch()
            await ctx.scene.enter('user-home-stat')
            break
        }
    }
})

module.exports = scene