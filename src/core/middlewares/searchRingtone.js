const { Telegraf, Composer } = require('telegraf')
const { Sequelize } = require('sequelize')
const { Models } = require('../../models')
const { Ringtones } = Models
const { constants, helpers } = require('../../utils')

const searchComposer = new Composer()

function makeAudioResultForAdmin(element, index){
    return {
        type: 'audio',
        id: String(index),
        title: element.name,
        input_message_content: {
            message_text: `<b>${element.name}</b>\n`+
            `${element.description != null ? element.description+'\n' : ''}`+
            `—————————\n`+
            `❤️${helpers.likeCounter(element.likes)} | ♻️${helpers.shareCounter(element.shares)}`+
            `<a href="${element.thumb_url}">&#8205</a>`,
            parse_mode: "HTML"
        },
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '❤️', callback_data: 'like'},
                    { text: '💾 Yuklash', callback_data: 'download'},
                    { 
                        text: '♻️', 
                        switch_inline_query_chosen_chat: {
                            query: constants.SEARCH_KEY_UZBEK_MOVIES + `${constants.SEARCH_ID}${element.id}`, 
                            allow_user_chats: true,
                            allow_group_chats: false,
                            allow_bot_chats: false,
                            allow_channel_chats: false
                        }
                    }
                ]
            ]
        },
        thumbnail_url: element.thumb_url,
    }
}

function makeAudioResultForUser(element, index){
    return {
        type: 'audio',
        id: String(index),
        title: element.name,
        description: element.description,
        input_message_content: {
            message_text: `<b>${element.name}</b>\n`+
            `${element.description != null ? element.description+'\n' : ''}`+
            `—————————\n`+
            `❤️${helpers.likeCounter(element.likes)} | ♻️${helpers.shareCounter(element.shares)}`+
            `<a href="${element.thumb_url}">&#8205</a>`,
            parse_mode: "HTML"
        },
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '❤️', callback_data: 'like'},
                    { text: '💾 Yuklash', callback_data: 'download'},
                    { 
                        text: '♻️', 
                        switch_inline_query_chosen_chat: {
                            query: constants.SEARCH_KEY_UZBEK_MOVIES + `${constants.SEARCH_ID}${element.id}`, 
                            allow_user_chats: true,
                            allow_group_chats: false,
                            allow_bot_chats: false,
                            allow_channel_chats: false
                        }
                    }
                ]
            ]
        },
        thumbnail_url: element.thumb_url,
    }
}

searchComposer.on('inline_query', async ctx => {
    try{
        const query = ctx.inlineQuery.query
        const dbQuery = { where: { name: { [Sequelize.Op.like]: `%${query}%` } }, order: [['name', 'ASC']] }        
        
        // previews
        const audios = await Ringtones.findAll(dbQuery)
        const results = audios.map( (element, index) => makeAudioResultForUser(ctx, element, index))

        ctx.answerInlineQuery(results, {
            cache_time: 0
        })
    }catch(err){
        console.log(err)
    }
})

searchComposer.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case 'like': {
            console.log(ctx.scene)
            ctx.answerCbQuery('Ushbu filmga ❤️ bosdingiz!', {
                show_alert: true
            })
        }
        // case callback_data.add: {
        //     await ctx.deleteMessage()
        //     await ctx.scene.enter('admin-home-uzbek_movies-add_name')
        //     break
        // }
        // case callback_data.back: {
        //     await ctx.deleteMessage()
        //     await ctx.scene.enter('admin-home')
        //     break
        // }
    }
})

module.exports = searchComposer.middleware()