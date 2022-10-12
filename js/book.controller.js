const BookProperties = {
    RATE: 'rate',
    PRICE: 'price',
    ID: 'id'
}

function onInit() {
    // resetIdNums()

    renderFilterByQueryStringParams()

    _createBooks()
    renderBooks()
    renderNextPages()
    // renderBooksInFilter()
}

const renderFilterByQueryStringParams = () => {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterByMinPrice = queryStringParams.get('minPrice') || 0
    const filterByMaxPrice = queryStringParams.get('maxPrice') || 0
    const filterByRate = queryStringParams.get(BookProperties.RATE) || 0

    if (!filterByMaxPrice && !filterByRate && !filterByMinPrice) {
        return
    }

    const filterBy = {
        minPrice: filterByMinPrice,
        maxPrice: filterByMaxPrice,
        rate: filterByRate,
        price: 0
    }

    document.querySelector('.filter-book-select').value = filterBy.minPrice || filterBy.maxPrice || filterBy.rate
    setBookFilter(filterBy)
}

function renderBooks() {
    var books = getBooks()
    const elHeadlineTable = document.querySelector('.table-headline')

    // Paging:
    const startIdx = gPageIdx * PAGE_SIZE // 0// 5
    books = books.slice(startIdx, startIdx + PAGE_SIZE) || ''//(0,5)//(5,10)

    const tableTitleItems = ['Id', 'Title', 'Price', 'Rate', 'Details', 'Delete', 'Update', 'Change Rate']
    const headlineHTML = tableTitleItems.map(item => `<td>${item}</td>`)

    var strHtmls = books.map((book, index) =>
        `
                <tr>
                    <td> ${book.id} </td>
                    <td> ${book.genre} </td>
                    <td>
                        <span>${book[BookProperties.PRICE]}</span>$
                    </td>
                    <td>
                        ${book.rate}
                    </td>
                    <td>
                        <button class="details-btn" onclick="onReadBook('${book.id}')">Details</button>
                    </td>
                    <td>
                        <button class="btn-remove" onclick="onDeleteBook('${book.id}')">
                            Delete
                        </button>
                    </td>
                    <td>
                        <button class="update-btn" onclick="onUpdateBook('${book.id}')">Update</button>
                    </td>
                    <td class="update-rate-btn">
                        <button onclick="changeTheRating(${index}, false )">-</button>
                        <button onclick="changeTheRating(${index}, true)">+</button>
                    </td>
                </tr>
            ` || undefined
    )
    document.querySelector('.table-container').innerHTML = strHtmls.join('')
    elHeadlineTable.innerHTML = headlineHTML.join('')
}

function onSetSortBy() {
    const selectedFilter = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked
    setBookSort(selectedFilter, isDesc)
    renderBooks()
}

function onSetFilterBy(filterBy = {}) {

    gFilterBy = setBookFilter(filterBy)
    renderBooks()
    const selectedFilter = document.querySelector('.filter-book-select').value
    const selectedPrice = document.querySelector('.filter-price-range').value

    const queryStringParams = `?${selectedFilter}=${selectedPrice}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    flashMsg(`Book Deleted`)
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +prompt('price?', '100')
    if (newPrice && book.price !== newPrice) {
        const book = updateBook(bookId, newPrice)
        renderBooks()
        flashMsg(`Price updated to: ${book.price}$`)
    }
}

function onAddBook() {
    var genre = prompt('genre?', 'comedy')
    if (genre) {
        const book = addBook(genre)
        renderBooks()
        flashMsg(`Book Added (id: ${book.id})`)
    }
}

function flashMsg(msg) {
    const elMsg = document.querySelector('.user-msg')
    elMsg.innerText = msg
    elMsg.classList.add('open')
    setTimeout(() => {
        elMsg.classList.remove('open')
    }, 3000)
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.genre || ''
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('p').innerText = book.desc
    elModal.classList.add('open')
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}


function nextPage(diff, isNextPage) {
    // if (diff + 1 === gDiffPages) return
    // console.log('diff', diff + 1);
    // console.log('gDiffPages', gDiffPages);

    if (diff) {
        gPageIdx = diff
        console.log('if 1');
        gDiffPages = diff
        return
    } else if (isNextPage) {
        gPageIdx++
        console.log('if 2');

    } else if (!isNextPage) {
        gPageIdx--
        console.log('if 3');
    }

    if (gPageIdx * PAGE_SIZE >= gBooks.length || gPageIdx * PAGE_SIZE < 0) {
        gPageIdx = 0
    }
}

function onNextPage(diff = 0, isNextPage = true) {
    console.log('onNextPage');
    nextPage(diff, isNextPage)
    renderBooks()
}

function changeTheRating(index, isIncreasing) {
    const book = getBooks()[index]
    if (isIncreasing && book.rate === 10 ||
        !isIncreasing && !book.rate) {
        return
    }

    updateBookProperty(
        book.id,
        BookProperties.RATE,
        isIncreasing
            ? book.rate + 1
            : book.rate - 1
    )
    renderBooks()
}

function renderNextPages() {
    const elPages = document.querySelector('.pagination_section')
    const amountPages = gBooks.length - 1 / PAGE_SIZE
    // console.log('amountPages **********', gBooks.length - 1 / PAGE_SIZE);
    var strHTML = `<a onclick="onNextPage( 0, false)">&lArr; Previous </a>`
    //todo:change this : strHTML += ['a', 'b','c']
    strHTML += ['a', 'b', 'c'].map((page, index) => `<a onclick="onNextPage(${index})">${index + 1}</a>`).join('')
    strHTML += `<a onclick="onNextPage(0,true)"> Next &rArr;</a>`
    elPages.innerHTML = strHTML
}

