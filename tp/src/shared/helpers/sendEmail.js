// Send a mail with email, subject and html given
export function sendEmail(email, subject, html) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Update the development environment with your SENDGRID_API_KEY
  const msg = {
    to: email,
    from: 'juancruzalmazan1994@gmail.com', // Verified sendgrid email, change it to grupo11unlp@gmail.com in the future
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