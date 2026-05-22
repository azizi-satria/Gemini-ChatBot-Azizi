import express from 'express'
import multer from 'multer'

const upload = multer()

import {

  generateTextController,
  generateImageController,
  generateDocumentController,
  generateAudioController,
  getChatHistoryController,
  getSingleChatController

} from '../controllers/chatController.js'

const router = express.Router()


// TEXT
router.post(
  '/generate-text',
  generateTextController
)


// IMAGE
router.post(
  '/generate-from-image',
  upload.single('image'),
  generateImageController
)


// DOCUMENT
router.post(
  '/generate-from-document',
  upload.single('document'),
  generateDocumentController
)


// AUDIO
router.post(
  '/generate-from-audio',
  upload.single('audio'),
  generateAudioController
)

export default router

router.get(
  '/chat-history',
  getChatHistoryController
)

router.get(
  '/chat/:id',
  getSingleChatController
)