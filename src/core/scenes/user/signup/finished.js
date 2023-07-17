const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { Models } = require('../../../../models')
const { User, Id } = Models
const { helpers } = require('../../../../utils')

const scene = new BaseScene('user-signup-finished')

scene.enter( async ctx => {
    let newId
    const thanksForNewID = ctx.i18n.t('user.extra_chance.my_ids.newID')
    const thanksForNewUser = ctx.i18n.t('user.extra_chance.my_ids.newUser')

    const user = await User.findOne({ where: { id: ctx.from.id }})

    if(!user.phone_number){
        newId = await Id.create({
            userId: ctx.from.id
        })
    }

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

    const referalId = ctx.session.referal

    if(referalId != null){
        const referrer = await User.findOne({ where: { id: referalId }})
        const referals = helpers.strToArr(referrer.referals)
        referals.push(ctx.from.id)
        referrer.referals = helpers.arrToStr(referals)
        await referrer.save()
    
        await ctx.telegram.sendMessage(referalId, thanksForNewUser, {
            parse_mode: 'HTML'
        })
        
        if(helpers.strToArr(referrer.referals).length % 2 == 0){
            await Id.create({
                userId: referalId
            })
    
            await ctx.telegram.sendMessage(referalId, thanksForNewID, {
                parse_mode: 'HTML'
            })
        }
    }

    ctx.scene.enter('user-subscription')
})

module.exports = scene