import pkg from 'nodemailer';
const {createTransport} = pkg;

const transporter = createTransport({
  service: 'Gmail', // You can use any email service
  auth: {
    // user: process.env.EMAIL_USER, // Your email address
    // pass: process.env.EMAIL_PASSWORD // Your email password or app-specific password
    user: "siavashyadak@gmail.com",
    pass: "cnkayrqqmspskgyf"
  }
});

function sendResetEmail(existingUser, token) {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  console.log(existingUser.Email);
  
  const mailOptions = {
    from: "siavashyadak@gmail.com",
    to: existingUser.Email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`
  };

  return transporter.sendMail(mailOptions);
}

export default sendResetEmail;
