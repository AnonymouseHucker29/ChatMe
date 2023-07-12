import { sendTypingOff } from "./typingAndSeenIndicator.js"

export async function callSendAPI(sender_psid, response) {

    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    await sendTypingOff(sender_psid);

    try {
        const res = await fetch(
            `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request_body),
            }
        );

        if (res.ok) {
            console.log('Message sent!');
        } else {
            console.error('Unable to send message:', res.status, res.statusText);
        }
    } catch (err) {
        console.error('Error sending message:', err);
    }
}