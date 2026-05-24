import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({

  sessionId:{
    type:String
  },

  title:{
    type:String,
    default:'New Chat'
  },

  messages:[

    {

      role:{
        type:String
      },

      text:{
        type:String
      }

    }

  ]

},{
  timestamps:true
})

const Chat = mongoose.model(
  'Chat',
  chatSchema
)

export default Chat