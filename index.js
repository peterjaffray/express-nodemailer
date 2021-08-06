const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
var config = require('./config.json')
const app = express();
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = process.env.PORT || 5000;

app.use('/v1', route);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    
});


const transporter = nodemailer.createTransport({
    port: 465,
    host: config.host,
    auth: {
        user: config.username,
        pass: config.password,
    },
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

route.post('/send-mail', (req, res) => {
    // const { subject, text } = req.body;
    // const mailData = {
    //     from: config.from,
    //     to: config.to,
    //     subject: subject,
    //     text: text,
    //     html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
    //     attachments: [
    //         {   // file on disk as an attachment
    //             filename: 'nodemailer.png',
    //             path: 'nodemailer.png'
    //         }
    //     ]
    // };

    readHTMLFile(__dirname + '/template.html', function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template();
        // console.log(htmlToSend)
        var mailOptions = {
            from: config.from,
            to: config.to,
            subject: "[Waiver]: Rajat Suri 3062417843",
            html : htmlToSend,
            attachments: [
                        {   // file on disk as an attachment
                            filename: 'signature-867-1628129052.png',
                            path: 'https://shootingcentre.com/wp-content/uploads/wpcf7_signatures/signature-867-1628129052.png'
                        }
                    ]
         };
         transporter.sendMail(mailOptions, function (error, info) {
             if (error) {
                 console.log(error);
                 res.status(200).send({ message: "Failed", message_id: -1, error: error.toString() });
                } else {
                console.log(res,info)
                res.status(200).send({ message: "Mail send", message_id: info.messageId });
            }
        });
    });

    // transporter.sendMail(mailData, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     res.status(200).send({ message: "Mail send", message_id: info.messageId });
    // });
});