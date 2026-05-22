import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

const GEMINI_MODEL = 'gemini-2.5-flash-lite'


// TEXT
export async function generateText(chatHistory){

  const response = await ai.models.generateContent({

    model: GEMINI_MODEL,

    contents: chatHistory

  })

  return response.text

}


// IMAGE
export async function generateFromImage(prompt, file){

  const base64Image = file.buffer.toString('base64')

  const response = await ai.models.generateContent({

    model: GEMINI_MODEL,

    contents: [
      {
        text: prompt
      },
      {
        inlineData: {
          mimeType: file.mimetype,
          data: base64Image
        }
      }
    ]

  })

  return response.text

}


// DOCUMENT
export async function generateFromDocument(prompt, file){

  const base64Document = file.buffer.toString('base64')

  const response = await ai.models.generateContent({

    model: GEMINI_MODEL,

    contents: [
      {
        text: prompt
      },
      {
        inlineData: {
          mimeType: file.mimetype,
          data: base64Document
        }
      }
    ]

  })

  return response.text

}


// AUDIO
export async function generateFromAudio(prompt, file){

  const base64Audio = file.buffer.toString('base64')

  const response = await ai.models.generateContent({

    model: GEMINI_MODEL,

    contents: [
      {
        text: prompt
      },
      {
        inlineData: {
          mimeType: file.mimetype,
          data: base64Audio
        }
      }
    ]

  })

  return response.text

}