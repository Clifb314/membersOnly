const displayPayment = (() => {
    const display = document.getElementById('payment')
    const select = document.getElementById('options')

    select.addEventListener('click', () => {
        let check = Number(select.value)
        if (check === 0) {
            display.textContent = 'Price : 1,000,000 USD, one time payment'
        } else if (check === 1) {
            display.textContent = 'Price : 10 USE / month'
        } else if (check === -1) {
            display.textContent = 'Price: FREE.99'
        } else {
            display.textContent = ''
        }
    })

})()