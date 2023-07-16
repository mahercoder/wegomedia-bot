const fs = require('fs')
const path = require('path')
const Configuration = require('../../config.json')
const { NODE_ENV } = process.env
const configFilePath = path.join(__dirname, '../..', 'config.json')

const isProduction = ["production", "prod"].includes(NODE_ENV)
const envName = isProduction ? "production" : "development"

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

const config = {
    isProduction: isProduction,
    token: Configuration[envName].BOT_TOKEN,
    owners: Configuration[envName].OWNERS,
    admins: Configuration[envName].ADMINS,
    database: {
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', `/${Configuration[envName].DATABASE_NAME}.db3`)
    },
    redis: {
        host: Configuration[envName].REDIS_HOST,
        port: Configuration[envName].REDIS_PORT
    },
    addAdmin, getAdmins, removeAdmin,
    addOwner, getOwners,
    isOwner, isAdmin
}

module.exports = config