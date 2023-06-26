const fs = require('fs')
const path = require('path')
const Configuration = require('../../config.json')
const { NODE_ENV } = process.env
const configFilePath = path.join(__dirname, '../..', 'config.json')

const isProduction = ["production", "prod"].includes(NODE_ENV)
const envName = isProduction ? "production" : "development"

function getPartnerChannels(){
    return Configuration[envName].PARTNER_CHANNELS_ID
}

function addPartnerChannel(chat_id){
    Configuration[envName].PARTNER_CHANNELS_ID.push(chat_id);
    fs.writeFileSync(configFilePath, JSON.stringify(Configuration))
}

function removePartnerChannel(index){
    Configuration[envName].PARTNER_CHANNELS_ID.splice(index, 1);
    fs.writeFileSync(configFilePath, JSON.stringify(Configuration))
}

function addAdmin(userId){
    Configuration.ADMINS.push(+userId)
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getAdmins(){
    return Configuration[envName].ADMINS
}

function removeAdmin(userId){
    for(let i=0; i < Configuration[envName].ADMINS.length; i++){
        if(userId == Configuration[envName].ADMINS[i]){
            Configuration[envName].ADMINS.splice(i, 1)
        }
   }

   fs.writeFileSync(configFilePath, JSON.stringify(Configuration))
}

function addOwner(userId){
    Configuration[envName].ADMINS.push(+userId)
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getOwners(){
    return Configuration[envName].OWNERS
}

// Ushbu kanalda bot adminligini tekshiradi
async function isBotAdminInThisChannel(ctx, channelId){
    try{
        const admins = await ctx.telegram.getChatAdministrators(channelId)
        const bot_username = ctx.botInfo.username
    
        for(let i=0; i < admins.length; i++){
            if(admins[i].user.username == bot_username){
                return true
            }
        }
    } catch(err){
        if(err){
            return false
        }
    }

    return false
}

// userId owner`ga tegishli bo'lsa true, aks holda false
function isOwner(userId){
    let result = false
    const owners = getOwners()
    
    for(let i=0; i < owners.length; i++){
        if(userId == owners[i]){
            result = true
        }
    }

    return result
}

// userId egasi bot'ni boshqara oladigan adminmi?
function isAdmin(userId){
    let result = false
    const admins = getAdmins()
    
    for(let i=0; i < admins.length; i++){
        if(userId == admins[i]){
            result = true
        }
    }

    return result
}

function getRingtoneCost(){
    return Configuration[envName].RINGTONE_COST
}

function setRingtoneCost(newCost){
    Configuration[envName].RINGTONE_COST = newCost
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getReferalCost(){
    return Configuration[envName].REFERAL_COST
}

function setReferalCost(newCost){
    Configuration[envName].REFERAL_COST = newCost
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getWithdrawability(){
    return Configuration[envName].IS_WITHDRAWABLE
}

function setWithdrawabality(isEnabled){
    Configuration[envName].IS_WITHDRAWABLE = isEnabled
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getPaymentChannelId(){
    return Configuration[envName].PAYMENTS_CHANNEL_ID
}

function setPaymentChannelId(channelId){
    Configuration[envName].PAYMENTS_CHANNEL_ID = channelId
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

const config = {
    isProduction: isProduction,
    token: Configuration[envName].BOT_TOKEN,
    owners: Configuration[envName].OWNERS,
    admins: Configuration[envName].ADMINS,
    channelId: Configuration[envName].CHANNEL_ID,
    storageChannelId: Configuration[envName].STORAGE_CHANNEL_ID,
    remoteStorage: Configuration[envName].STORAGE,
    previewSeconds: Configuration[envName].PREVIEW_SECONDS,
    database: {
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', `/${Configuration[envName].DATABASE_NAME}.db3`)
    },
    redis: {
        host: Configuration[envName].REDIS_HOST,
        port: Configuration[envName].REDIS_PORT
    },
    getPartnerChannels, addPartnerChannel, removePartnerChannel,
    addAdmin, getAdmins, removeAdmin,
    addOwner, getOwners,
    isBotAdminInThisChannel,
    isOwner, isAdmin,
    getRingtoneCost, setRingtoneCost,
    getReferalCost, setReferalCost,
    getWithdrawability, setWithdrawabality,
    getPaymentChannelId, setPaymentChannelId
}

module.exports = config