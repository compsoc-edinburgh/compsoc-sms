const get_sel = async id => {
    const response = await fetch(`/messages/${id}`, {
        credentials: 'include'
    }).then(r => r.json())

    const main = document.querySelector('main')
    if (response.success === true) {
        main.classList.remove('empty')
        main.classList.add('messages')

        let msgs = response.messages.map(m => {
            const time = new Date(m.time).toISOString()
            return `
            <div class="message">
                <details>
                    <summary class="message__content">${m.content}</summary>
                    <ul>
                        <li>Received: ${time}</li>
                        <li>Receiving number: ${m.num_to}</li>
                    </ul>
                </details>
            </div>`
        })

        main.innerHTML = `
            <div class="messages__container">
                <div class="messages__display">
                    ${msgs.join('')}
                </div>
            </div>
            <div class="messages__bar">
                <span id="refresh">refresh</span>
            </div>
        `

        document.querySelector('#refresh')
            .addEventListener('click', () => get_sel(id))
        document.querySelector('.messages__container')
            .scrollTop = 10000000000
    } else {
        main.classList.add('empty')
        main.classList.remove('messages')

        main.innerHTML = `<code>${response.msg}</code>`
    }
}

document.querySelectorAll('[name="convo"]')
    .forEach(el => {
        el.addEventListener('click', () => get_sel(el.value))

        el.checked = false
    })
