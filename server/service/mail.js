import nodemailer from 'nodemailer'

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_SMTP,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: `Активация аккаунта на ${process.env.CLIENT_URL}`,
      text: '',
      html: `
      <div>
        <h1>Для активации перейдите ниже по ссылке</h1>
        <a href="${link}">${link}</a>
      </div>
      `
    })
  }
}

export default new MailService()