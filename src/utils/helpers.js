const fs = require('fs')
const path = require('path')
const axios = require('axios')
const XLSX = require('xlsx')
const config = require('./config')
const Constants = require('./constants.json');


/**
 * ButtonObject -> { text: 'some text', callback_data: 'some_text' }
 * @param {Array<ButtonObject>} buttons
 * @return {Array<InlineKeyboardButton>}
 */
function makeInlineKeyboard(buttons){
    const inline_keyboard = [];
    for(let i=0; i < buttons.length; i++){
        inline_keyboard.push(buttons[i]);
    }
    return {
        inline_keyboard: inline_keyboard
    }
}

/**
 * Example: matrixify([1,2,3,4,5,6,7,8], 3) === [[1,2,3][4,5,6][7,8]]
 * 
 * @param arr 
 * @param dimen 
 */
function matrixify(arr, dimen){
  let matrix = [], i, k;

  for(i=0, k=-1; i < arr.length; i++){
      if(i % dimen === 0){
          k++;
          matrix[k] = [];
      }
      matrix[k].push(arr[i]);
  }

  return matrix;
}

// Ushbu intervaldagi [min, max] tasodifiy sonlarni qaytaradi
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Array<number> dan String ga o'tkazuvchi funksiya
function arrToStr(arr) {
    return arr.join(',');
}

// String dan Array<number> ga o'tkazuvchi funksiya
function strToArr(str) {
    if (str === '' || str === null) {
      return [];
    } else {
      const arr = str.split(',');
      return arr.map(Number);
    }
}

function extractNumberFromStart(text) {
    const startCommand = '/start ';
    if (text.startsWith(startCommand)) {
      const numberStr = text.slice(startCommand.length);
      const number = Number(numberStr);
      if (!isNaN(number)) {
        return number;
      }
    }
    return null;
}

/**
 * `cmd` `/help`, `/setvc` kabi bo'lishi mumkin
 */
function extractNumberFromCommand(cmd, text) {
    const startCommand = `${cmd} `;
    if (text.startsWith(startCommand)) {
      const numberStr = text.slice(startCommand.length);
      const number = Number(numberStr);
      if (!isNaN(number)) {
        return number;
      }
    }
    return null;
}

function isThere(arr, element){
    
    for(let i=0; i < arr.length; i++){
        if(arr[i] === element){
            return true;
        }
    }

    return false;
}

function getChannels(){
  return Constants.partnerChannels.general;
}

function addChannel(chat_id){
  Constants.partnerChannels.general.push(chat_id);

  fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants));
}

function removeChannel(index){
  Constants.partnerChannels.general.splice(index, 1);
  fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants));
}

function addDistrictChannel(district_id, chat_id){
  Constants.partnerChannels.byDistrict[district_id].channel_ids.push(chat_id);
  fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants));
}

function removeDistrictChannel(district_id, index){
  Constants.partnerChannels.byDistrict[district_id].channel_ids.splice(index, 1);
  fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants));
}

function getDistrictChannels(district_id){
  return Constants.partnerChannels.byDistrict[district_id].channel_ids;
}

function addRegionChannel(district_id, region_id, chat_id){
  Constants.partnerChannels.byRegion[district_id][region_id].channel_ids.push(chat_id);
  fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants));
}

function removeRegionChannel(district_id, region_id, index){
  Constants.partnerChannels.byRegion[district_id][region_id].channel_ids.splice(index, 1);
  fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants));
}

function getRegionChannels(district_id, region_id){
  return Constants.partnerChannels.byRegion[district_id, region_id].channel_ids;
}

function getDistricts(){
  return Constants.partnerChannels.byDistrict
}

function getRegions(districtId){
  return Constants.partnerChannels.byRegion[districtId]
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

function writeId(){
  let regions = Constants.partnerChannels.byRegion
  for(let i=0; i < regions.length; i++){
    for(let n=0; n < regions[i].length; n++){
      regions[i][n].id = n
    }
  }

  Constants.partnerChannels.byRegion = regions

  fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants))
}

writeId()

module.exports = {
  makeInlineKeyboard,
  matrixify,
  getRandomNumber,
  strToArr, arrToStr, isThere,
  extractNumberFromStart, extractNumberFromCommand,
  getChannels, addChannel, removeChannel,
  getDistrictChannels, addDistrictChannel, removeDistrictChannel,
  getRegionChannels, addRegionChannel, removeRegionChannel,
  isBotAdminInThisChannel,
  getDistricts, getRegions
}