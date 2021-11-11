const sgMail = require('@sendgrid/mail');

// Send a mail with email, subject and html given
async function sendEmail(email, subject, html) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Update the development environment with your SENDGRID_API_KEY
  const msg = {
    to: email,
    from: 'juancrujca@gmail.com', // Verified sendgrid email
    subject: subject,
    html: html,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

module.exports = {
  sendEmail,
};
