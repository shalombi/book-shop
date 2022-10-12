'use strict'
const gGenre = ['comedy', 'action', 'romantic', 'biography', 'science']
const STORAGE_KEY = 'booksDataBase'
const PAGE_SIZE = 5

var gFilterBy = { genre: '', price: 0, searchTxt: '' }
var gPageIdx = 0
var gBooks



function getBooks() {
    const selectedFilter = document.querySelector('.filter-book-select').value
    const sortBySearchTxt = getTxtFromSearch()
    if ((!selectedFilter && !sortBySearchTxt)) {
        return gBooks
    }

    // Filtering:
    var books
    if (selectedFilter) {
        console.log('if 1')
        const selectedPrice = gFilterBy.price || document.querySelector('.filter-price-range').value
        // sortByMinMaxPrice(books, sortByMinMax)
        switch (selectedFilter) {
            case 'maxPrice':
                books = gBooks.filter(book => book.price <= selectedPrice)
                break;
            case 'minPrice':
                books = gBooks.filter(book => book.price >= selectedPrice)
                break;
            case 'search':
                books = gBooks.filter(book => book.name.toLowerCase().includes(sortBySearchTxt?.toLowerCase()))
                break;
            default:
                return gBooks
        }

        return books
    }

    return books
}

var gCurrPage = 1

const currPage = gCurrPage

function _createBook(genre) {
    return {
        genre,
        author: 'puki',
        name: genre,
        price: getRandomIntInclusive(0, 100),
        desc: makeLorem(),
        rate: 0,
        id: makeId(),
        // id: drawNumId()

        //defaulted of rate is 0, set rate to be random only for checking features
        // rate: getRandomIntInclusive(0, 10),
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 21; i++) {
            var genre = gGenre[getRandomIntInclusive(0, gGenre.length - 1)]
            books.push(_createBook(genre))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function setBookSort(sortBy = '', isDesc) {
    //{rate:1}
    if (sortBy === 'price') {
        descendingSorting('price', isDesc)
    }
    else if (sortBy === 'rate') {
        descendingSorting('rate', isDesc)
    }

}


function descendingSorting(sortBy, isDesc) {
    // console.log('isDesc', isDesc);
    gBooks.sort((b1, b2) =>
        (b1[sortBy] > b2[sortBy])
            ? isDesc
                ? - 1
                : 1
            : isDesc
                ? 1
                : -1
    )
}
//rate:5 //rate:1 //rate:5 
//true
//-1

//rate:5 //rate:1
//false
//1


function _saveCarsToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function setBookFilter(filterBy = {}) {
    const searchTxt = getTxtFromSearch()


    gFilterBy.price = filterBy.price || 0
    gFilterBy.minPrice = filterBy.minPrice
    gFilterBy.maxPrice = filterBy.maxPrice
    gFilterBy.rate = filterBy.rate
    gFilterBy.searchTxt = searchTxt
    return gFilterBy
}

function getTxtFromSearch() {
    const elSearchTxt = document.querySelector('.searchTxt')
    // console.log('elSearchTxt %%%%', elSearchTxt.value);

    return elSearchTxt.value
}


function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveCarsToStorage()
}


function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveCarsToStorage()
    return book
}

function updateBookProperty(bookId, propertyName, newValue) {
    const book = gBooks.find(book => book.id === bookId)
    book[propertyName] = newValue
    _saveCarsToStorage()
    return book
}
function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function addBook(genre) {
    const book = _createBook(genre)
    gBooks.unshift(book)
    _saveCarsToStorage()
    return book
}


