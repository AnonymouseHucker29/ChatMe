import express from "express"
import body_parser from "body-parser"
import dotenv from "dotenv"

dotenv.config()

const app = express().use(body_parser.json())

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"]
  let token = req.query["hub.verify_token"]
  let challenge = req.query["hub.challenge"]

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.PAGE_ACCESS_TOKEN) {
      console.log("WEBHOOK_VERIFIED")
      res.status(200).send(challenge)
    } else {
      res.sendStatus(403)
    }
  }
})
