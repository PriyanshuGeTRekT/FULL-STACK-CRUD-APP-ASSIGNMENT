// Fake email service using console logs.
// Keeping it simple—no external dependencies.

const initMailService = () => {
    console.log('MailService: Email system ready (Console Log Mode)');
};

const sendWelcomeEmail = async (user) => {
    // Pretend to send a welcome email.
    console.log(`MailService: Mock sending welcome email to ${user.email}`);
};

const sendNotificationEmail = async (user, subject, message) => {
    // Mock sending a notification email.
    console.log(`MailService: Sending notification to ${user.email}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message: ${message}`);
};

module.exports = { initMailService, sendWelcomeEmail, sendNotificationEmail };
