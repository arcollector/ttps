// require sendEmail
const { sendEmail } = require('./emailSender');

// Send a bill to an email given
export function sendConsent(email, consent) {
  let subject = "Informed Consent";
  let html = ejs.render('consentEmail', {consent: this.consent});
  sendEmail(email, subject, html);
}