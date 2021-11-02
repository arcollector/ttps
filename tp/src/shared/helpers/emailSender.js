// Send a mail with email, subject and html given
export function sendEmail(email, subject, html) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey('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'); // Update the development environment with your SENDGRID_API_KEY
  const msg = {
    to: email,
    from: 'grupo11unlp@gmail.com', // Verified sendgrid email
    subject: subject,
    html: html,
  };
  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body)
      }
    }
  })();
}