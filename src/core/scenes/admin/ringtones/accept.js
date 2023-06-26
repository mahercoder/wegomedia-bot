const fs = require('fs')
const path = require('path')
const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { config, helpers } = require('../../../../utils')
const { Models } = require('../../../../models')
const { Ringtones } = Models

const callback_data = {
    yes: 'admin.ringtones.accept.yes',
    no: 'admin.ringtones.accept.no',
    back: 'admin.ringtones.accept.back',
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.no), callback_data: callback_data.no },
            { text: ctx.i18n.t(callback_data.yes), callback_data: callback_data.yes }
        ],
        [{ 
            text: ctx.i18n.t(callback_data.back), 
            callback_data: callback_data.back
        }],
    ]
}

const scene = new BaseScene('admin-home-ringtones-accept')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.ringtones.accept.caption', {
        name: ctx.session.temp_ringtone.name
    })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.session.temp_message = await ctx.telegram.copyMessage(ctx.from.id, config.storageChannelId, ctx.session.temp_ringtone.post_id, {
        caption,
        parse_mode: 'HTML',
        reply_markup: keyboard
    })
})

scene.action(/.+/, async ctx => {
    try{
        const action = ctx.callbackQuery.data
        switch(action){
            case callback_data.yes: {
                helpers.uploadFromTg(ctx, ctx.session.temp_ringtone.file_id, async (fileURL, filePath) => {
                    
                    const previewFilePath = path.join(__dirname, '../../../..', `cache/${ctx.session.temp_ringtone.name} - preview.mp3`)
                    helpers.makePreview(filePath, ctx.session.temp_ringtone.prev, previewFilePath, async () => {
                        const { message_id, audio } = await ctx.telegram.sendAudio(config.storageChannelId, { source: previewFilePath })
                        fs.unlinkSync(previewFilePath)
                        
                        helpers.uploadFromTg(ctx, audio.file_id, async (previewFileURL, previewFilePath) => {
                            await Ringtones.create({
                                name: ctx.session.temp_ringtone.name,
                                file_url: fileURL,
                                post_id: ctx.session.temp_ringtone.post_id,
                                preview_file_url: previewFileURL,
                                preview_post_id: message_id
                            })

                            fs.unlinkSync(filePath)
                            fs.unlinkSync(previewFilePath)

                            await ctx.replyWithHTML(ctx.i18n.t('admin.ringtones.accept.created'))
                        })
                    })
                    await ctx.deleteMessage(ctx.session.temp_message.message_id)
                    await ctx.scene.enter('admin-home-ringtones')
                }).catch( async err => {
                    console.log(err)
                    await ctx.replyWithHTML(ctx.i18n.t('admin.ringtones.accept.rejected'))
                })
                break
            }
            case callback_data.no: {
                ctx.telegram.deleteMessage(config.storageChannelId, ctx.session.temp_ringtone.file).catch()
                ctx.session.temp_ringtone = null
                await ctx.deleteMessage()
                await ctx.scene.enter('admin-home-ringtones')
                break
            }
            case callback_data.back: {
                ctx.telegram.deleteMessage(config.storageChannelId, ctx.session.temp_ringtone.file).catch()
                await ctx.deleteMessage()
                await ctx.scene.enter('admin-home-ringtones-add_file')
                break
            }
        }
    } catch(err){
        console.log(err)
    }
})

module.exports = scene