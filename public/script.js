
    const promptInput = document.getElementById('prompt')

    promptInput.addEventListener('keydown', function(e){

      if(e.key === 'Enter' && !e.shiftKey){

        e.preventDefault()

        sendMessage()

      }

    })

    async function sendMessage(){

           
        const prompt = promptInput.value.trim()

        const button = document.querySelector('button')

button.disabled = true

button.innerText = 'Loading...'

      if(!prompt) return

      const chatBox = document.getElementById('chat-box')

      const fileInput = document.getElementById('document')

      const imageInput = document.getElementById('image')

      chatBox.innerHTML += `
        <div class="message user">
          <div class="bubble">
            ${prompt}
          </div>
        </div>
      `

      promptInput.value = ''

      chatBox.scrollTop = chatBox.scrollHeight

      chatBox.innerHTML += `
        <div class="message bot" id="loading">
          <div class="bubble">
           ⏳ Gemini sedang mengetik...
          </div>
        </div>
      `

      chatBox.scrollTop = chatBox.scrollHeight
      button.disabled = false
      button.innerText = 'Kirim'

      try{

        let response

        // DOCUMENT
        if(fileInput.files.length > 0){

          const formData = new FormData()

          formData.append('document', fileInput.files[0])

          formData.append('prompt', prompt)

          response = await fetch('/generate-from-document', {

            method:'POST',

            body: formData

          })

        }

        // IMAGE
        else if(imageInput.files.length > 0){

          const formData = new FormData()

          formData.append('image', imageInput.files[0])

          formData.append('prompt', prompt)

          response = await fetch('/generate-from-image', {

            method:'POST',

            body: formData

          })

        }

        // TEXT
        else{

          response = await fetch('/generate-text', {

            method:'POST',

            headers:{
              'Content-Type':'application/json'
            },

            body: JSON.stringify({
              prompt: prompt
            })

          })

        }

        const data = await response.json()

        document.getElementById('loading').remove()

        chatBox.innerHTML += `
          <div class="message bot">
            <div class="bubble">
              ${data.result}
            </div>
          </div>
        `

      }catch(error){

        document.getElementById('loading').remove()

        chatBox.innerHTML += `
          <div class="message bot">
            <div class="bubble">
              Quota Gemini habis sementara.
Tunggu beberapa saat lalu coba lagi.
            </div>
          </div>
        `

      }

      fileInput.value = ''
      imageInput.value = ''

      chatBox.scrollTop = chatBox.scrollHeight

    }

    async function loadHistory(){

  const response = await fetch('/chat-history')

  const chats = await response.json()

  const historyList = document.getElementById('history-list')

  historyList.innerHTML = ''

  chats.forEach((chat, index) => {

   historyList.innerHTML += `

  <div
    class="history-item"
    onclick="openChat('${chat._id}')"
  >

    Chat ${index + 1}

  </div>

`

  })

}

loadHistory()

async function openChat(chatId){

  const response = await fetch(`/chat/${chatId}`)

  const chat = await response.json()

  const chatBox = document.getElementById('chat-box')

  chatBox.innerHTML = ''

  chat.messages.forEach((message) => {

    const roleClass =
      message.role === 'user'
      ? 'user'
      : 'bot'

    chatBox.innerHTML += `

      <div class="message ${roleClass}">

        <div class="bubble">

          ${message.text}

        </div>

      </div>

    `

  })

}

