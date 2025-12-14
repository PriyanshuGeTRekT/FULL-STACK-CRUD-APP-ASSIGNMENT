// Mail service (console-mode by default).
// This module intentionally provides a lightweight mock implementation
// so the app can run without external SMTP/API keys during demos.
//
// To replace with a real provider (e.g. nodemailer or SendGrid),
// implement the same exported functions and call provider APIs.

const logger = require('../utils/logger');

const initMailService = () => {
    logger.info('MailService: Email system ready (Console Log Mode)');
};

const sendWelcomeEmail = async (user) => {
    // Console-mode: log email details so demos and tests remain offline-safe.
    logger.info(`MailService: Mock sending welcome email to ${user.email}`);
};

const sendNotificationEmail = async (user, subject, message) => {
    logger.info(`MailService: Sending notification to ${user.email}`);
    logger.info(`   Subject: ${subject}`);
    logger.info(`   Message: ${message}`);
};

// Example provider stub (commented):
/*
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const sendWelcomeEmail = async (user) => {
    await transporter.sendMail({
        from: 'no-reply@example.com',
        to: user.email,
        subject: 'Welcome!',
        text: `Welcome ${user.name}`
    });
};
*/

module.exports = { initMailService, sendWelcomeEmail, sendNotificationEmail };
