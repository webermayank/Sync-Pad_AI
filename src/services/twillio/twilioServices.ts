
// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure

 
require("dotenv").config();

import twilio from 'twilio';

class TwilioService{

  private client : twilio.Twilio;
 
constructor(){
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
this.client = twilio(accountSid, authToken);
}
async init() {

  try {
  const call = await this.client.calls
  .create({
    url: "http://demo.twilio.com/docs/voice.xml",
    to: "+919310568828",
    from: "+12764099716",
  })
  console.log('calling',call.sid);
  } catch (error) {
    console.error("error in calling", error);
  }

}
}

const twilioService = new TwilioService();
export default  twilioService;