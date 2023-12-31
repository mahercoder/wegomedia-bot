const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { helpers } = require('../../../utils')
const { Models } = require('../../../models')
const { User } = Models

const callback_data = {
    about_comp: "ℹ️ Konkurs haqida",
    guide: "🔖 Yo'riqnoma",
    sponsorship: "🤝 Hamkorlik",
    extra_chance: "🎁 Qo'shimcha imkoniyat",
    stat: "📊 Statistika"
}

function makeButtons(){
    return {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
            [{ text: callback_data.about_comp }, { text: callback_data.guide }],
            [{ text: callback_data.sponsorship }, { text: callback_data.extra_chance }],
            [{ text: callback_data.stat }]
        ]
    }
}

const scene = new BaseScene('user-home')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.home.caption')
    const keyboard = makeButtons()
    ctx.session.currentSceneMessage = await ctx.reply(caption, { reply_markup: keyboard })
})

scene.hears([
    callback_data.about_comp,
    callback_data.guide,
    callback_data.sponsorship,
    callback_data.extra_chance,
    callback_data.stat
], 
async ctx => {
    const action = ctx.message.text
    switch(action){
        case callback_data.about_comp: {
            await ctx.deleteMessage().catch()
            await ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
            ctx.scene.enter('user-home-about_comp')
            break
        }
        case callback_data.guide: {
            await ctx.deleteMessage().catch()
            await ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
            ctx.scene.enter('user-home-guide')
            break
        }
        case callback_data.sponsorship: {
            await ctx.deleteMessage().catch()
            await ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
            ctx.scene.enter('user-home-sponsorship')
            break
        }
        case callback_data.extra_chance: {
            await ctx.deleteMessage().catch()
            await ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
            ctx.session.givenScene = 'user-home-extra_chance'
            ctx.scene.enter('user-subscription')
            break
        }
        case callback_data.stat: {
            await ctx.deleteMessage().catch()
            await ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
            ctx.scene.enter('user-home-stat')
            // const userCount = await User.count()
            // await ctx.deleteMessage().catch()
            // await ctx.deleteMessage(ctx.session.currentSceneMessage.message_id).catch()
            // const userCountCaption = ctx.i18n.t('admin.stats.caption', { userCount })
            // await ctx.replyWithHTML(userCountCaption)
            // await ctx.scene.reenter()
            break
        }
    }
})

module.exports = scene
















// const { Scenes } = require('telegraf')
// const { BaseScene } = Scenes
// const { helpers } = require('../../../utils')
// const { Models } = require('../../../models')
// const { User } = Models

// const callback_data = {
//     about_comp: 'user.home.about_comp',
//     guide: 'user.home.guide',
//     sponsorship: 'user.home.sponsorship',
//     extra_chance: 'user.home.extra_chance',
//     stat: 'user.home.stat',
// }

// function makeButtons(ctx){
//     return [
//         [
//             { text: ctx.i18n.t(callback_data.about_comp), callback_data: callback_data.about_comp }, 
//             { text: ctx.i18n.t(callback_data.guide), callback_data: callback_data.guide }
//         ],
//         [
//             { text: ctx.i18n.t(callback_data.sponsorship), callback_data: callback_data.sponsorship }, 
//             { text: ctx.i18n.t(callback_data.extra_chance), callback_data: callback_data.extra_chance }
//         ],
//         [{ text: ctx.i18n.t(callback_data.stat), callback_data: callback_data.stat } ]
//     ]
// }

// const scene = new BaseScene('user-home')

// scene.enter( async ctx => {
//     const caption = ctx.i18n.t('user.home.caption')
//     const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
//     ctx.reply(caption, { reply_markup: keyboard })
// })

// scene.hears()

// // scene.action(/.+/, async ctx => {
// //     const action = ctx.callbackQuery.data
// //     switch(action){
// //         case callback_data.about_comp: {
// //             ctx.deleteMessage().catch()
// //             ctx.scene.enter('user-home-about_comp')
// //             break
// //         }
// //         case callback_data.guide: {
// //             ctx.deleteMessage().catch()
// //             ctx.scene.enter('user-home-guide')
// //             break
// //         }
// //         case callback_data.sponsorship: {
// //             ctx.deleteMessage().catch()
// //             ctx.scene.enter('user-home-sponsorship')
// //             break
// //         }
// //         case callback_data.extra_chance: {
// //             ctx.deleteMessage().catch()
// //             ctx.scene.enter('user-home-extra_chance')
// //             break
// //         }
// //         case callback_data.stat: {
// //             const userCount = await User.count()
// //             await ctx.deleteMessage()
// //             const userCountCaption = ctx.i18n.t('admin.stats.caption', { userCount })
// //             await ctx.replyWithHTML(userCountCaption)
// //             await ctx.scene.reenter()
// //             break
// //         }
// //     }
// // })

// module.exports = scene