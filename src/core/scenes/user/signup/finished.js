const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { Models } = require('../../../../models')
const { User, Id } = Models

const scene = new BaseScene('user-signup-finished')

scene.enter( async ctx => {
    const newId = await Id.create({
        userId: ctx.from.id
    })

    const user = await User.findOne({ where: { id: ctx.from.id }})
    user.fullname = ctx.session.signup_user.fullname
    user.phone_number = ctx.session.signup_user.phone
    user.district = ctx.session.signup_user.district
    user.region = ctx.session.signup_user.region
    user.username = ctx.session.signup_user.username
    user.language_code = ctx.session.signup_user.language_code

    await user.save()

    const caption = ctx.i18n.t('user.signup.finished', {
        givenId: newId.id
    })
    
    await ctx.replyWithHTML(caption, {
        disable_web_page_preview: true 
    })

    ctx.scene.enter('user-home')
})

module.exports = scene