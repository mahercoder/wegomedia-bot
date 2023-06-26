const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { config, helpers } = require('../../../../utils')

const callback_data = {
    back: 'admin.ringtones.add_file.back',
}

function makeButtons(ctx){
    return [
        [{ 
            text: ctx.i18n.t(callback_data.back), 
            callback_data: callback_data.back
        }],
    ]
}

const scene = new BaseScene('admin-home-ringtones-add_file')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.ringtones.add_file.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.session.temp_message = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.on('audio', async ctx => {
    try{
        const audio = ctx.message.audio

        if(audio.mime_type === 'audio/mpeg' && audio.file_name.endsWith('.mp3')){
            const postedMessage = await ctx.copyMessage(config.storageChannelId)
            ctx.session.temp_ringtone.file_id = audio.file_id
            ctx.session.temp_ringtone.post_id = postedMessage.message_id
            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.temp_message.message_id)
            await ctx.scene.enter('admin-home-ringtones-add_prev')
        } else {
            await ctx.deleteMessage(ctx.session.temp_message.message_id)
            await ctx.replyWithHTML(ctx.i18n.t('admin.ringtones.add_file.ignored'))
            await ctx.scene.reenter()
        }
    } catch(err){
        console.log(err)
    }
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.back: {
            await ctx.deleteMessage()
            await ctx.scene.enter('admin-home-ringtones-add_name')
            break
        }
    }
})

module.exports = scene

/**
 * 


{
  message_id: 10313,
  from: {
    id: 792684458,
    is_bot: false,
    first_name: 'Mohirbek',
    username: 'mahercoder',
    language_code: 'en'
  },
  chat: {
    id: 792684458,
    first_name: 'Mohirbek',
    username: 'mahercoder',
    type: 'private'
  },
  date: 1685710118,
  audio: {
    duration: 51,
    file_name: 'Damir.mp3',
    mime_type: 'audio/mpeg',
    title: 'shaxrizoda',
    performer: 'damir',
    thumbnail: {
      file_id: 'AAMCAgADGQEAAihJZHnlJu8b6jaWJP8KFzgeAYLQt4kAApUqAALQAdBL0JiM4QUPbHwBAAdtAAMvBA',
      file_unique_id: 'AQADlSoAAtAB0Ety',
      file_size: 18684,
      width: 320,
      height: 320
    },
    thumb: {
      file_id: 'AAMCAgADGQEAAihJZHnlJu8b6jaWJP8KFzgeAYLQt4kAApUqAALQAdBL0JiM4QUPbHwBAAdtAAMvBA',
      file_unique_id: 'AQADlSoAAtAB0Ety',
      file_size: 18684,
      width: 320,
      height: 320
    },
    file_id: 'CQACAgIAAxkBAAIoSWR55SbvG-o2liT_Chc4HgGC0LeJAAKVKgAC0AHQS9CYjOEFD2x8LwQ',
    file_unique_id: 'AgADlSoAAtAB0Es',
    file_size: 1667118
  }
}

*
**/