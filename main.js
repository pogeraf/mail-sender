const Mailjet = require("node-mailjet");
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express()
const port = 3000

const jsonParser = bodyParser.json()

app.use(bodyParser.json({ type: 'application/json' }))

app.use(cors());

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
        apiKey: 'ea502818bff21c00d6dce0ac0305304a',
        apiSecret: '6d43ba391713c5427ce66c21dc649789'
    });

    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "pogeraf2001@gmail.com",
                        Name: "Mailjet Pilot"
                    },
                    To: [
                        {
                            Email: "pogeraf2001@gmail.com",
                            Name: "passenger 1"
                        }
                    ],
                    Subject: "Test",
                    TextPart: "Hello",
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
