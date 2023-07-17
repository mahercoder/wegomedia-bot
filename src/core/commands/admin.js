const { config } = require('../../utils')

module.exports = {
    name: `admin`,
    action:
    async function(ctx){
        if(config.isAdmin(ctx.from.id)){
            ctx.scene.enter('admin-home')
        }
    }
}