const validator = (() => {
    //inputs
    const pw1 = document.getElementById('pw1')
    const pw2 = document.getElementById('pw2')
    const uName = document.getElementById('uName')
    const lName = document.getElementById('lName')
    const fName = document.getElementById('fName')
    const email = document.getElementById('email')
    const errors = document.getElementById('signupErrors')
    const btn = document.getElementById('signupSubmit')
    //function to append and clear
    function clear() {
        while (errors.hasChildNodes()) {
            errors.removeChild(errors.firstChild)
        }
    }

    function appendError(msg, field) {
        clear()
        const newError = document.createElement('p')
        newError.className = 'errors'
        newError.textContent = `${field} : ${msg}`
        errors.appendChild(newError)
    }


    pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    //password check
    pw2.addEventListener('focusout', () => {
        if (pw1.value !== pw2.value) {
            appendError('Passwords must match', 'Password')
            btn.disabled = true
        } else if (!pwRegex.test(pw1.value)) {
            appendError('Check that password meeds minimum requirements', 'Password')
            btn.disabled = true
        } else {
            btn.disabled = false
        }
    })

    //Name checks
    function nameCheck(e, regex, msg, field) {
        if (!regex.test(e.value)) {
            appendError(msg, field)
            return false
        } else {
            return true
        }
    }

    const nameRegex = /^[A-Za-z]+$/
    const uNameRegex = /^[A-Za-z0-9]+$/
    const emailRegex = /\S+@{1}[A-Za-z]+\.{1}[a-z]{2,3}$/
    lName.addEventListener('focusout', () => {
        if (nameCheck(lName, nameRegex, 'No Special Characters', 'Last Name')) {
            clear()
        }
    })
    fName.addEventListener('focusout', () => {
        if (nameCheck(fName, nameRegex, 'No Special Characters', 'First Name')) {
            clear()
        }})
    uName.addEventListener('focusout', () => {
        if (nameCheck(uName, uNameRegex, 'Must be alphanumberic', 'User Name')) {
            clear()
        }})
    email.addEventListener('focusout', () => {
        if (nameCheck(email, emailRegex, 'Must enter a valid email', 'Email')) {
        clear()
    }})

})()