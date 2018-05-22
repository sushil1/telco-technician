import twilio from 'twilio';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../.env')
});

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const from = process.env.TWILIO_PHONE_NUMBER;
const to = process.env.ADMIN_PHONE_NUMBER;

export default function sendSmsToAdmin(text) {
  client.messages
    .create({
      from: from,
      to: to,
      body: text
    })
    .then(message =>
      console.log('sms sent to admin. Message id is ' + message.sid)
    );
}
