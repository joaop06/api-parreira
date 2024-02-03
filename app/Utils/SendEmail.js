const nodemailer = require('nodemailer')

class SendEmail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: process.env.MAILER_SERVICE,
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            secure: false, // true for 465, false for others ports
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        })
    }

    async sendMail(config) {
        // const { to, subject, html, attachments } = config

        const resutl = await this.transport.sendMail({
            from: {
                name: 'Api Parreira',
                address: process.env.MAILER_EMAIL
            },
            ...config
        })

        return resutl
    }
}

module.exports = SendEmail