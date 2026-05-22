import {

  generateText,
  generateFromImage,
  generateFromDocument,
  generateFromAudio

} from '../services/geminiService.js'

import Chat from '../models/chatModel.js'



// TEXT
export async function generateTextController(req, res){

  const { prompt } = req.body

  try{

    // BUAT SESSION CHAT
    if(!req.session.chatHistory){

      req.session.chatHistory = []

    }

    // SIMPAN USER MESSAGE
    req.session.chatHistory.push({

      role:'user',

      parts:[
        {
          text:prompt
        }
      ]

    })


    if(req.session.chatHistory.length > 6){

  req.session.chatHistory =
    req.session.chatHistory.slice(-6)

}

    // GEMINI
    const aiResponse = await generateText(
      req.session.chatHistory
    )

    // SIMPAN RESPONSE AI
    req.session.chatHistory.push({

      role:'model',

      parts:[
        {
          text:aiResponse
        }
      ]

    })

    const limitedMessages =
  req.session.chatHistory.slice(-20)

    await Chat.findOneAndUpdate(

  {

    sessionId:req.sessionID

  },

  {

    sessionId:req.sessionID,

    messages:limitedMessages.map(item => ({

      role:item.role,

      text:item.parts[0].text

    }))

  },

  {

    upsert:true

  }

)

    res.json({
      result: aiResponse
    })

  }catch(e){

    console.log(e.message)

    res.status(500).json({
      message:e.message
    })

  }

}


// IMAGE
export async function generateImageController(req, res){

  try{

    const prompt = req.body.prompt || 'Describe this image'

    const aiResponse = await generateFromImage(prompt, req.file)

    res.json({
      result: aiResponse
    })

  }catch(e){

    console.log(e.message)

    res.status(500).json({
      message:e.message
    })

  }

}


// DOCUMENT
export async function generateDocumentController(req, res){

  try{

    const prompt = req.body.prompt || 'Summarize this document'

    const aiResponse = await generateFromDocument(prompt, req.file)

    res.json({
      result: aiResponse
    })

  }catch(e){

    console.log(e.message)

    res.status(500).json({
      message:e.message
    })

  }

}


// AUDIO
export async function generateAudioController(req, res){

  try{

    const prompt = req.body.prompt || 'Transcribe this audio'

    const aiResponse = await generateFromAudio(prompt, req.file)

    res.json({
      result: aiResponse
    })

  }catch(e){

    console.log(e.message)

    res.status(500).json({
      message:e.message
    })

  }

}

export async function getChatHistoryController(req, res){

  try{

    const chats = await Chat.find()

    res.json(chats)

  }catch(e){

    console.log(e.message)

    res.status(500).json({
      message:e.message
    })

  }

}

export async function getSingleChatController(req, res){

  try{

    const chat = await Chat.findById(req.params.id)

    res.json(chat)

  }catch(e){

    console.log(e.message)

    res.status(500).json({
      message:e.message
    })

  }

}