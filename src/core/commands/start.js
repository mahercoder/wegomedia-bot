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

        if(created || !savedUser.phone_number){
            try{
                const text = ctx.message.text
                const referalId = helpers.extractNumberFromStart(text)
                
                if(referalId != null){                    
                    ctx.session.referal = referalId
                }

            } catch(err){
                console.log(err)
            }

            ctx.scene.enter('user-signup')
        } else {
            ctx.scene.enter('user-subscription')
        }
    }
}