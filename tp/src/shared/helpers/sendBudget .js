// require sendEmail
const { sendEmail } = require('./emailSender');

// Send a bill to an email given
export function sendBudget(email, factura) {
  let subject = "Survey Bill";
  let html = ejs.render('budgetEmail', {factura: this.factura});
  sendEmail(email, subject, html);
}