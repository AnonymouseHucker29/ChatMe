export async function showTypingIndicator(sender_psid) {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on"
    };

    try {
        await fetch(
            `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request_body),
            }
        );
    } catch (err) {
        console.error('Error sending typing indicator:', err);
    }
}

export async function markMessageAsSeen(sender_psid, message_id) {
    const request_body = {
        recipient: {
            id: sender_psid,
        },
        sender_action: 'mark_seen',
        message_id: message_id,
    };

    try {
        await fetch(`https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request_body),
        });
    } catch (err) {
        console.error('Error marking message as seen:', err);
    }
}

export async function sendTypingOff(sender_psid) {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_off"
    };

    try {
        await fetch(
            `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request_body),
            }
        );
    } catch (err) {
        console.error('Error sending typing off event:', err);
    }
}