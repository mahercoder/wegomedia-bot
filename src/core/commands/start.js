const { Models } = require('../../models')
const { Id, User } = Models
const { helpers } = require('../../utils')

module.exports = {
    name: `start`,
    action:
    async function(ctx){
        const [savedUser, created] = await User.findOrCreate({
            where: { id: ctx.from.id },
            defaults: {
                id: ctx.from.id,
                fullname: ctx.from.first_name ? ctx.from.first_name : "Noma'lum" + ' ' + ctx.from.last_name ? ctx.from.last_name : '',
                username: ctx.from.username,
                createdAt: helpers.getGMT5().toISOString()
            }
        })

        if(created){
            try{
                const text = ctx.message.text
    
                const referalId = helpers.extractNumberFromStart(text)
                
                if(referalId != null){
                    const thanksForNewID = ctx.i18n.t('user.extra_chance.my_ids.newID')
                    const thanksForNewUser = ctx.i18n.t('user.extra_chance.my_ids.newUser')
                    
                    ctx.session.referal = referalId

                    const referrer = await User.findOne({ where: { id: referalId }})
                    const referals = helpers.strToArr(referrer.referals)
                    referals.push(savedUser.id)
                    referrer.referals = helpers.arrToStr(referals)
                    await referrer.save()
    
                    await ctx.telegram.sendMessage(referalId, thanksForNewUser, {
                        parse_mode: 'HTML'
                    })
                    
                    if(referrer.referals.length % 5 == 0){
                        const newId = await Id.create({
                            userId: ctx.from.id
                        })

                        await ctx.telegram.sendMessage(referalId, thanksForNewID, {
                            parse_mode: 'HTML'
                        })
                    }
                }
            } catch(err){
                console.log(err)
            }

            ctx.scene.enter('user-signup')
        } else {
            ctx.scene.enter('user-home')
        }
    }
}