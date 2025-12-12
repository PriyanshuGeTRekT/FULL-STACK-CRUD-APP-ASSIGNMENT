const nodemailer = require('nodemailer');

let transporter;
let mockMode = false;

const initMailService = async () => {
    try {
        if (process.env.SMTP_HOST) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            console.log('MailService: Configured with SMTP');
        } else if (process.env.ENABLE_ETHEREAL === 'true') {
            console.log('MailService: Attempting to connect to Ethereal...');
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

            console.log('MailService: Connected to Ethereal');
            console.log(`User: ${testAccount.user}, Pass: ${testAccount.pass}`);
        } else {
            console.log('MailService: Defaulting to Mock Mode (Console Logs). Set ENABLE_ETHEREAL=true to use test email.');
            mockMode = true;
        }
    } catch (err) {
        console.warn('MailService: Failed to initialize. Falling back to Mock Mode.', err.message);
        mockMode = true;
    }
};

// Initialize silently
initMailService();

const sendWelcomeEmail = async (user) => {
    // If not initialized yet and not in mock mode, wait a bit or try init (simplified: just check flag)
    if (!transporter && !mockMode) {
        // Retry init once if needed, or just warn
        console.log('MailService: Still initializing...');
        return;
    }

    if (mockMode || !transporter) {
        console.log('================ [MOCK EMAIL] ================');
        console.log(`To: ${user.email}`);
        console.log(`Subject: Welcome to the platform!`);
        console.log(`Body: Hello ${user.name}, Welcome to our simple User CRUD platform...`);
        console.log('==============================================');
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: '"Junior Dev App" <no-reply@crudapp.test>',
            to: user.email,
            subject: 'Welcome to the platform!',
            text: `Hello ${user.name},\n\nWelcome to our simple User CRUD platform. We created your account successfully.\n\nCheers,\nThe Team`,
            html: `<p>Hello <strong>${user.name}</strong>,</p><p>Welcome to our simple User CRUD platform. We created your account successfully.</p><p>Cheers,<br>The Team</p>`,
        });

        console.log(`Message sent: ${info.messageId}`);
        if (nodemailer.getTestMessageUrl(info)) {
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
    } catch (err) {
        console.error('MailService: Failed to send email.', err.message);
    }
};

module.exports = { sendWelcomeEmail };
