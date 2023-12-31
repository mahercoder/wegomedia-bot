const { Scenes } = require('telegraf')
const { BaseScene } = Scenes

const scene = new BaseScene('user-signup')

scene.enter( async ctx => {
    ctx.session.signup_user = {}
    ctx.scene.enter('user-signup-get_phone')
})

module.exports = [
    scene,
    require('./get_phone'),
    require('./get_district'),
    require('./get_region'),
    require('./finished')
]