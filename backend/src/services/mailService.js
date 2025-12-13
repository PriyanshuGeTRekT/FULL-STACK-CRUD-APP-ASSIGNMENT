// Simple Email Service (Console Simulation)
// No external dependencies to keep the project light for junior devs.

const initMailService = () => {
    console.log('MailService: Email system ready (Console Log Mode)');
};

const sendWelcomeEmail = async (user) => {
    console.log(`MailService: Mock sending welcome email to ${user.email}`);
};

module.exports = { initMailService, sendWelcomeEmail };
