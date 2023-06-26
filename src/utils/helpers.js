const fs = require('fs')
const path = require('path')
const axios = require('axios')
const XLSX = require('xlsx')
const config = require('./config')
const AWS = require('aws-sdk')
const ffmpeg = require('fluent-ffmpeg')

// AWS konfiguratsiyasini sozlash
const s3 = new AWS.S3({
    accessKeyId: config.remoteStorage.accessKeyId, // <--- заменить
    secretAccessKey: config.remoteStorage.secretAccessKey, // <--- заменить
    endpoint: config.remoteStorage.endpoint,
    region: config.remoteStorage.region,
    s3ForcePathStyle: true,
    apiVersion: 'latest'
})

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
    };
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

async function makePreview(sourcePath, initalSeconds, savingPath, cb=()=>{}){
    ffmpeg({
        source: sourcePath
    })
    .setStartTime(0)
    .setDuration(initalSeconds)
    .save(savingPath)
    .on('end', () => cb())
    .on('error', (err) => {
      console.error('Fayl qirqishda xato yuz berdi:', err)
    })
}

/**
 * `file_id` bo'yicha audio faylni telegram serveridan olib, 
 * TimeWeb S3 omboriga saqlaydi. `Callback` parametri sifatida
 * S3 ombordagi audio faylning URL manzilini qaytaradi.
 * Callback ya'ni `cb` uchun parametr qilib (fileURL)
 */
async function uploadFromTg(ctx, file_id, cb=()=>{}){
    try{
        const imageURL = await ctx.telegram.getFileLink(file_id)
        const localPath = path.join(__dirname, '..', `/cache/${file_id}.mp3`)

        const response = await axios({
            method: 'GET',
            url: imageURL,
            responseType: 'stream'
        })
    
        response.data.pipe(fs.createWriteStream(localPath))
        .on('finish', () => {
            const fileContent = fs.readFileSync(localPath)
    
            const params = {
                Bucket: config.remoteStorage.bucketName,
                Key: `${file_id}.mp3`,
                Body: fileContent
            }
    
            s3.upload(params, (err, data) => {
                if (err) throw err
                cb(data.Location, localPath)
                // fs.unlinkSync(localPath)
            })
        })

    } catch(error){
      console.log(error)
    }
}

module.exports = {
    makeInlineKeyboard,
    getRandomNumber,
    strToArr, arrToStr, isThere,
    extractNumberFromStart, extractNumberFromCommand,
    makePreview, uploadFromTg
}