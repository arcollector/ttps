// require sendEmail
const { sendEmail } = require('./emailSender');

// Send a bill to an email given
export function sendResult(email, result) {
  let subject = "Study Result";
  let html = ejs.render('resultEmail', {result: this.result});
  sendEmail(email, subject, html);
}