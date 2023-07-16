const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { Models } = require('../../../../models')
const { User, Id } = Models

const scene = new BaseScene('user-signup-finished')

scene.enter( async ctx => {
    const newId = await Id.create({
        userId: ctx.from.id
    })

    await User.create({
        id: ctx.from.id,
        fullname: ctx.session.signup_user.fullname,
        phone_number: ctx.session.signup_user.phone,
        district: ctx.session.signup_user.district,
        region: ctx.session.signup_user.region,
        username: ctx.from.username,
        language_code: ctx.from.language_code
    })

    const caption = ctx.i18n.t('user.signup.finished', {
        givenId: newId.id
    })
    
    await ctx.replyWithHTML(caption, {
        disable_web_page_preview: true 
    })

    ctx.scene.enter('user-home')
})

module.exports = scene