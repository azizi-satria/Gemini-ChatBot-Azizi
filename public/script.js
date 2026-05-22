let currentChatId = null

const promptInput =
  document.getElementById('prompt')

promptInput.addEventListener(
  'keydown',
  function(e){

    if(
      e.key === 'Enter' &&
      !e.shiftKey
    ){

      e.preventDefault()

      sendMessage()

    }

})

/* =========================
   APPEND MESSAGE
========================= */

function appendMessage(role){

  const chatBox =
    document.getElementById('chat-box')

  const messageDiv =
    document.createElement('div')

  messageDiv.classList.add(
    'message',
    role
  )

  // AVATAR
  const avatar =
    document.createElement('div')

  avatar.classList.add('avatar')

  avatar.innerHTML =

    role === 'user'
    ? '🧑'
    : '🤖'

  // BUBBLE
  const bubble =
    document.createElement('div')

  bubble.classList.add('bubble')

  // USER DI KANAN
  if(role === 'user'){

    messageDiv.appendChild(bubble)

    messageDiv.appendChild(avatar)

  }

  // BOT DI KIRI
  else{

    messageDiv.appendChild(avatar)

    messageDiv.appendChild(bubble)

  }

  chatBox.appendChild(messageDiv)

  chatBox.scrollTop =
    chatBox.scrollHeight

  return bubble

}

function addCopyButtons(){

  document
  .querySelectorAll('pre')
  .forEach((block)=>{

    if(
      block.querySelector('.copy-btn')
    ) return

    const button =
      document.createElement('button')

    button.innerText = 'Copy'

    button.classList.add('copy-btn')

    button.onclick = ()=>{

      navigator.clipboard.writeText(

        block.innerText

      )

      button.innerText = 'Copied!'

      setTimeout(()=>{

        button.innerText = 'Copy'

      },2000)

    }

    block.appendChild(button)

  })

}

/* =========================
   TYPEWRITER
========================= */

async function typeWriter(
  element,
  text
){

  element.classList.add('typing')

  let currentText = ''

  for(let i = 0; i < text.length; i++){

    currentText += text.charAt(i)

    element.innerHTML =
      marked.parse(currentText)

    hljs.highlightAll()

    const chatBox =
      document.getElementById('chat-box')

    chatBox.scrollTop =
      chatBox.scrollHeight

    await new Promise(resolve =>
      setTimeout(resolve,10)
    )

  }

  element.classList.remove('typing')

}

document
.querySelectorAll('pre')
.forEach((block)=>{

  if(
    block.querySelector('.copy-btn')
  ) return

  const button =
    document.createElement('button')

  button.innerText = 'Copy'

  button.classList.add('copy-btn')

  button.onclick = ()=>{

    navigator.clipboard.writeText(

      block.innerText

    )

    button.innerText = 'Copied!'

    setTimeout(()=>{

      button.innerText = 'Copy'

    },2000)

  }

  block.appendChild(button)

})

/* =========================
   SEND MESSAGE
========================= */

async function sendMessage(){

  const prompt =
    promptInput.value.trim()

  if(!prompt) return

  const button =
    document.querySelector('.send-btn')

  const fileInput =
    document.getElementById('document')

  const imageInput =
    document.getElementById('image')

  // USER MESSAGE
  const userBubble =
    appendMessage('user')

  userBubble.innerHTML =
    marked.parse(prompt)

  promptInput.value = ''

  // BOT LOADING
  const botBubble =
    appendMessage('bot')

  botBubble.innerHTML =
    '⏳ Gemini sedang mengetik...'

  button.disabled = true

  button.innerHTML = 'Loading...'

  try{

    let response

    // DOCUMENT
    if(fileInput.files.length > 0){

      const formData =
        new FormData()

      formData.append(
        'document',
        fileInput.files[0]
      )

      formData.append(
        'prompt',
        prompt
      )

      response = await fetch(

        '/generate-from-document',

        {

          method:'POST',

          body:formData

        }

      )

    }

    // IMAGE
    else if(imageInput.files.length > 0){

      const formData =
        new FormData()

      formData.append(
        'image',
        imageInput.files[0]
      )

      formData.append(
        'prompt',
        prompt
      )

      response = await fetch(

        '/generate-from-image',

        {

          method:'POST',

          body:formData

        }

      )

    }

    // TEXT
    else{

      response = await fetch(

        '/generate-text',

        {

          method:'POST',

          headers:{
            'Content-Type':
              'application/json'
          },

          body:JSON.stringify({

            prompt,

            chatId:currentChatId

          })

        }

      )

    }

    const data =
      await response.json()

    // SAVE CHAT ID
    currentChatId =
      data.chatId

    // TYPEWRITER RESPONSE
    await typeWriter(

      botBubble,

      data.result

    )
    addCopyButtons()

  }

  catch(error){

    console.log(error)

    botBubble.innerHTML =
      'Terjadi kesalahan server.'

  }

  finally{

    button.disabled = false

    button.innerHTML = `

      <i class="fa-solid fa-paper-plane"></i>

      Kirim

    `

    fileInput.value = ''

    imageInput.value = ''

    loadHistory()

  }

}

/* =========================
   LOAD HISTORY
========================= */

async function loadHistory(){

  try{

    const response =
      await fetch('/chat-history')

    const chats =
      await response.json()

    const historyList =
      document.getElementById(
        'history-list'
      )

    historyList.innerHTML = ''

    chats.forEach((chat)=>{

      historyList.innerHTML += `

        <div
          class="history-item"
          onclick="openChat('${chat._id}')"
        >

          ${chat.title}

        </div>

      `

    })

  }

  catch(error){

    console.log(error)

  }

}

/* =========================
   OPEN CHAT
========================= */

async function openChat(chatId){

  const response =
    await fetch(`/chat/${chatId}`)

  const chat =
    await response.json()

  currentChatId = chat._id

  const chatBox =
    document.getElementById('chat-box')

  chatBox.innerHTML = ''

  chat.messages.forEach((message)=>{

    const bubble =
      appendMessage(

        message.role === 'user'
        ? 'user'
        : 'bot'

      )

    bubble.innerHTML =
      marked.parse(message.text)

  })

  hljs.highlightAll()

}

/* =========================
   NEW CHAT
========================= */

function newChat(){

  currentChatId = null

  document.getElementById(
    'chat-box'
  ).innerHTML = ''

}

promptInput.addEventListener(
  'input',
  () => {

    promptInput.style.height = 'auto'

    promptInput.style.height =
      promptInput.scrollHeight + 'px'

  }
)

/* =========================
   INIT
========================= */

loadHistory()