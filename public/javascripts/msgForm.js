const toggleForm = (() => {
    const form = document.getElementById('msgSubmit')
    const container = document.getElementById('msgContainer')
    const p = document.getElementById('msgTitle')

    container.addEventListener('click', () => {
        if (form.className === 'closed') {
            form.style.animationPlayState = 'paused'
            container.style.animationPlayState = 'paused'
            form.className = 'open'
            form.style.animationPlayState = 'running'
            container.className = 'closed'
            p.className = 'closed'
            container.style.animationPlayState = 'running'
        } else {
            form.style.animationPlayState = 'paused'
            container.style.animationPlayState = 'paused'
            form.className = 'closed'
            form.style.animationPlayState = 'running'
            container.className = 'open'
            p.className = 'open'
            container.style.animationPlayState = 'running'
        }
    })

})()