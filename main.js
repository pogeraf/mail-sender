const Mailjet = require("node-mailjet");
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.SERVER_PORT

const jsonParser = bodyParser.json()

app.use(bodyParser.json({ type: 'application/json' }))

app.use(cors());

app.get('/', (req, res) => {
    res.json('OK')
})

app.post('/', jsonParser, (req, res) => {
    if (!req.body?.mail) {
        res.statusCode = 400;
        res.json({
            error: 'Mail is required'
        })
        return
    }

    if (!req.body?.phone) {
        res.statusCode = 400;
        res.json({
            error: 'Phone is required'
        })
        return
    }

    send(req.body)
    res.json(req.body)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function send({ mail, phone }) {
    const mailjet = new Mailjet({
        apiKey: process.env.MAILJET_API_KEY,
        apiSecret: process.env.MAILJET_API_SECRET
    });

    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAILJET_EMAIL_FROM,
                        Name: process.env.MAILJET_NAME_FROM
                    },
                    To: [
                        {
                            Email: process.env.MAILJET_EMAIL_TO,
                            Name: process.env.MAILJET_NAME_TO
                        }
                    ],
                    Subject: process.env.MAILJET_SUBJECT,
                    HTMLPart: `E-mail: ${mail}<br>Phone: ${phone}`
                }
            ]
        })
    request
        .then((result) => {
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
}
