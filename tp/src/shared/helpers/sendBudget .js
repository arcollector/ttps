// require sendEmail
const { sendEmail } = require('./emailSender');

// Send a bill to an email given
export function sendBudget(email, bill) {
  let subject = "Survey Bill";
  let html = ejs.render('budgetEmail', {bill: this.bill});
  sendEmail(email, subject, html);
}