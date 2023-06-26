// const { Models } = require('../../models');
// const { User, Game } = Models;
// const { logger } = require('../../utils');

module.exports = {
    name: `start`,
    action:
    async function(ctx){
        // const user = await User.findOne({ where: { id: ctx.from.id }});

        // if(!user){
        //     ctx.session.thisUser = (await User.create({
        //         id: ctx.from.id,
        //         fullname: ctx.from.first_name,
        //         username: ctx.from.username
        //     })).dataValues;
        // } else {
        //     ctx.session.thisUser = user.dataValues;
        // }

        ctx.scene.enter('user-home')
    }
}