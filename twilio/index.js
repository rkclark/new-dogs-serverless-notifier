/* eslint-disable no-console */
const {
  TWILIO_ID,
  TWILIO_TOKEN,
  TWILIO_FROM_PHONE_NUMBER,
  TWILIO_TO_PHONE_NUMBER,
} = process.env;

const client = require('twilio')(TWILIO_ID, TWILIO_TOKEN);

module.exports = {
  sendSMS: async (body) => {
    const sentMessage = await client.messages.create({
      body,
      from: TWILIO_FROM_PHONE_NUMBER,
      to: TWILIO_TO_PHONE_NUMBER,
    });
    console.log(`Successfully sent text message! ${sentMessage.sid}`);

    return sentMessage;
  },
};
