const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));  // Serves index.html

const csrf_token = "YOUR_CSRF_TOKEN_HERE";  // Replace with actual token if needed

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const sub_cookie = async function (key, token) {
    try {
        let r_ticket = await fetch("https://auth.roblox.com/v1/authentication-ticket/redeem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "rbxauthenticationnegotiation": 1,
                "user-agent": "Roblox/WinInet",
                "origin": "https://www.roblox.com",
                "referer": "https://www.roblox.com/my/account",
                'x-csrf-token': token
            },
            body: JSON.stringify({ authenticationTicket: key })
        });

        if (r_ticket.status !== 200) {
            if (r_ticket.status === 429) {
                console.log("   > Ratelimited while making cookie, delaying (60 seconds)");
                await delay(60000);
                return await sub_cookie(key, token);
            } else {
                const json = await r_ticket.json();
                return { error: JSON.stringify(json) };
            }
        } else {
            const new_cookie = r_ticket.headers.get("set-cookie").split(`.ROBLOSECURITY=`)[1].split(`; domain`)[0];
            return { new_cookie: ".ROBLOSECURITY=" + new_cookie };
        }
    } catch (err) {
        return { error: err.message };
    }
};

const create_cookie = async function (cookie, token) {
    try {
        let c_ticket = await fetch("https://auth.roblox.com/v1/authentication-ticket", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "user-agent": "Roblox/WinInet",
                "origin": "https://www.roblox.com",
                "referer": "https://www.roblox.com/my/account",
                "cookie": ".ROBLOSECURITY=" + cookie,
                'x-csrf-token': token
            }
        });

        if (c_ticket.status !== 200) {
            const json = await c_ticket.json();
            return { error: JSON.stringify(json) };
        } else {
            const ticket_key = c_ticket.headers.get("rbx-authentication-ticket");
            if (ticket_key != null) {
                return await sub_cookie(ticket_key, token);
            }
        }
    } catch (err) {
        return { error: err.message };
    }
};

app.post('/auth', async (req, res) => {
    const userCookie = req.body.cookie;
    if (!userCookie) return res.status(400).json({ error: 'Missing cookie.' });

    const result = await create_cookie(userCookie, csrf_token);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
