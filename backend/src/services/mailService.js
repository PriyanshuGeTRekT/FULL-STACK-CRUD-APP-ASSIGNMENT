const nodemailer = require('nodemailer');

let transporter;

const initMailService = async () => {
    if (process.env.SMTP_HOST) {
        // Configured SMTP (Real Email)
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        console.log('MailService: Configured with custom SMTP');
    } else {
        // Default: JSON Transport (Logs to Console)
        // reliable alternative to Ethereal that never crashes
        transporter = nodemailer.createTransport({
            jsonTransport: true
        });
        console.log('MailService: No SMTP configured. Using Console/JSON Transport (Simulated).');
    }
};

// Initialize immediately
initMailService();

const sendWelcomeEmail = async (user) => {
    if (!transporter) {
        console.log('MailService: Not initialized yet.');
        return;
    }

    try {
        const message = {
            from: '"Junior Dev App" <no-reply@crudapp.test>',
            to: user.email,
            subject: 'Welcome to the platform!',
            text: `Hello ${user.name},\n\nWelcome to our simple User CRUD platform. We created your account successfully.\n\nCheers,\nThe Team`,
            html: `<p>Hello <strong>${user.name}</strong>,</p><p>Welcome to our simple User CRUD platform. We created your account successfully.</p><p>Cheers,<br>The Team</p>`,
        };

        const info = await transporter.sendMail(message);

        if (process.env.SMTP_HOST) {
            console.log(`Message sent: ${info.messageId}`);
        } else {
            // Log the simulated email clearly to console
            console.log('----------------------------------------------------');
            console.log('📧  EMAIL SIMULATION (No external service used)   📧');
            console.log('----------------------------------------------------');
            console.log(`To:      ${user.email}`);
            console.log(`Subject: Welcome to the platform!`);
            console.log('----------------------------------------------------');
            console.log(info.message); // This contains the full JSON of the email
            console.log('----------------------------------------------------');
        }
    } catch (err) {
        console.error('MailService: Failed to send email', err);
    }
};

module.exports = { sendWelcomeEmail };
