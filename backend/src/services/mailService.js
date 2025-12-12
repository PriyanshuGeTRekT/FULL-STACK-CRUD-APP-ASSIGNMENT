const nodemailer = require('nodemailer');

// Create a transporter. 
// For real apps, user would swap this with SendGrid/AWS SES credentials in .env
let transporter;

const initMailService = async () => {
    if (process.env.SMTP_HOST) {
        // Use configured SMTP
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Use Ethereal for testing (no auth needed initially, or auto-generate)
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        console.log('MailService: Using Ethereal (Test) Account');
        console.log(`User: ${testAccount.user}, Pass: ${testAccount.pass}`);
    }
};

// Initialize on load (or could be lazy)
initMailService().catch(console.error);

const sendWelcomeEmail = async (user) => {
    if (!transporter) {
        await initMailService();
    }

    const info = await transporter.sendMail({
        from: '"Junior Dev App" <no-reply@crudapp.test>',
        to: user.email,
        subject: 'Welcome to the platform!',
        text: `Hello ${user.name},\n\nWelcome to our simple User CRUD platform. We created your account successfully.\n\nCheers,\nThe Team`,
        html: `<p>Hello <strong>${user.name}</strong>,</p><p>Welcome to our simple User CRUD platform. We created your account successfully.</p><p>Cheers,<br>The Team</p>`,
    });

    console.log(`Message sent: ${info.messageId}`);
    // Preview only available when using Ethereal
    if (nodemailer.getTestMessageUrl(info)) {
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
};

module.exports = { sendWelcomeEmail };
