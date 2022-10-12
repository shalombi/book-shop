'use strict'
// var gIdx = 101
const BOOK_AMOUNT = 99
var gNums

function makeLorem(wordCount = 15) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (wordCount > 0) {
        wordCount--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

// set Id options
function makeId(length = 6) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var txt = ''
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function makeIdNum() {
    //gIdx = 101
    gIdx++ //gIdx = 102
    return gIdx
}

//set ID with splice
function resetIdNums() {
    gNums = []

    for (var i = 0; i < BOOK_AMOUNT; i++) {
        gNums.push(i + 1)
    }
}

function drawNumId() {
    return gNums.splice(getRandomIntInclusive(0, gNums.length), 1)
}