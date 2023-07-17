const { Markup } = require("telegraf")

module.exports = (ctx) => {
    const referalLink = `https://t.me/${ctx.botInfo.username}?start=${ctx.from.id}`
    const username = ctx.from.username ? '@'+ctx.from.username : ctx.from.first_name
    
    const caption = ctx.i18n.t('user.extra_chance.friends_help.caption', {
      username, referalLink
    })
    
    const keyboard = Markup.inlineKeyboard([
      Markup.button.url('🎉 Konkursda qatnashish', referalLink),
    ])
    
    const results = [{
        type: 'article',
        id: 1,
        title: "Referal havola",
        description: "Qatnashing va sovg'alardan biriga ega chiqing!",
        input_message_content: {
          message_text: caption,
          parse_mode: "HTML",
          disable_web_page_preview: true
        },
        thumbnail_url: "https://www.nicepng.com/png/detail/300-3002326_share-your-personal-referral-link-with-a-friend.png",
        ...keyboard
    }]
    
    ctx.answerInlineQuery(results, {
      cache_time: 0,
    });
}

// module.exports = (ctx) => {
//   const caption = ctx.i18n.t('user.extra_chance.friends_help.caption', {
//     username: ctx.from.username ? '@'+ctx.from.username : ctx.from.first_name,
//     referalLink: `https://t.me/${ctx.botInfo.username}?start=${ctx.from.id}`
//   })
    
//   const results = [
//     {
//       type: 'article',
//       id: 1,
//       title: "Referal havolani ulashish",
//       input_message_content: {
//         message_text: caption,
//         parse_mode: "HTML",
//         disable_web_page_preview: true
//       },
//       thumbnail_url: "https://www.nicepng.com/png/detail/300-3002326_share-your-personal-referral-link-with-a-friend.png"
//     },
//   ]
  
//   ctx.answerInlineQuery(results, {
//     cache_time: 0,
//   })
// }