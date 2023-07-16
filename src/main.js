import dotenv from 'dotenv'
import express from 'express'
import body_parser from 'body-parser'
//import fetch from 'node-fetch' // Uncomment this line if you are using node version < 16
import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { callSendAPI } from './handlers/sendAPI.js'
import { markMessageAsSeen, showTypingIndicator } from './misc/typingAndSeenIndicator.js'

dotenv.config();

const app = express().use(body_parser.json());

const chatGPTAPI = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.OPENAI_ACCESS_TOKEN,
    apiReverseProxyUrl: process.env.REVERSE_PROXY_URL,
    fetch: fetch,
});

let conversationId, parentMessageId;

app.listen(process.env.PORT || 1337, () =>
    console.log(`webhook is listening @ port ${process.env.PORT || 1337}`)
);

app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(async function (entry) {

            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            if (webhook_event.message) {
                await handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                // Handle postbacks (to be implemented)
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

async function handleMessage(sender_psid, received_message, message_id) {

    if (received_message.is_echo) {
        return;
    }

    let response;

    if (received_message && received_message.text) {

        const prompt = received_message.text;

        await markMessageAsSeen(sender_psid, message_id);
        await showTypingIndicator(sender_psid, received_message.mid);

        const chatGPTResponse = await chatGPTAPI.sendMessage(prompt, {
            conversationId: conversationId,
            parentMessageId: parentMessageId,
            role: 'system',
        });

        response = {
            "text": chatGPTResponse.text
        };

        conversationId = chatGPTResponse.conversationId;
        parentMessageId = chatGPTResponse.parentMessageId;

        await callSendAPI(sender_psid, response);
    }
}