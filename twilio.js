const express           = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser        = require('body-parser');

const open_db = require('./db')
const debug   = require('debug')('app:sms')

const sms_app = express();
sms_app.use(bodyParser.urlencoded({ extended: true }));

/* Twilio Example
{
  ToCountry: 'US',
  ToState: 'TX',
  SmsMessageSid: 'SM6b537db3f2760a1b089026671d102c1d',
  NumMedia: '0',
  ToCity: 'GOLIAD',
  FromZip: '06120',
  SmsSid: 'SM6b537db3f2760a1b089026671d102c1d',
  FromState: 'CT',
  SmsStatus: 'received',
  FromCity: 'HARTFORD',
  Body: 'Hello, world!',
  FromCountry: 'US',
  To: '+13612667762',
  ToZip: '77963',
  NumSegments: '1',
  MessageSid: 'SM6b537db3f2760a1b089026671d102c1d',
  AccountSid: 'AC457a4c3b33dfc746ace83925f8e3da64',
  From: '+18608160578',
  ApiVersion: '2010-04-01'
}
*/

sms_app.post('/sms', async (req, res) => {
    const twiml = new MessagingResponse();

    twiml.message('go away dad');
    debug('got text', req.body)

    // get the author id
    db = await open_db()

    let num_id = await db.get('SELECT id FROM Numbers WHERE num=?', req.body.From)

    if (num_id === undefined) {
        let result = await db.run('INSERT INTO Numbers (num) VALUES (?)', req.body.From)
        num_id = result.lastID
        debug(`created new conversation with id ${num_id}`)
    } else {
        num_id = num_id.id
        debug(`resolved conversation with id ${num_id}`)
    }
    console.log('author', num_id , process.env['DATABASE'])
    
    await db.run(
        'INSERT INTO Messages (content, time, num_to, num_id) VALUES (?,?,?,?)',
        req.body.Body,
        Date.now(),
        req.body.To,
        num_id
    );

    res.writeHead(200, {'Content-Type': 'text/xml'});
    //res.end(twiml.toString());
    res.end('')
});

module.exports = sms_app

