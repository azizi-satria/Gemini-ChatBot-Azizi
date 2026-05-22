import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({

  role:String,

  text:String

})

const chatSchema = new mongoose.Schema({

  sessionId:String,

  messages:[messageSchema]

})

const Chat = mongoose.model('Chat', chatSchema)

export default Chat