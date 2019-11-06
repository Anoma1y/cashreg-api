import Config from '../config';
import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, auth } = mailConfig;
    
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth,
    });
  }
  
  sendMail = message => {
    if (!Config.email_send) {
      console.log(message);
      return;
    }

    return this.transporter.sendMail({
      ...mailConfig.defaultMessage,
      ...message,
    })
  };

  sendRegistrationMail = (data) => {
    const { user_id, token_id, token, email, key } = data;
    const activationLink = `https://example.test/auth/signup/confirm?user_id=${user_id}&code_id=${token_id}&code=${token}`; // todo add host for confirm email

    this.sendMail({
      to: email,
      subject: 'Подтверждение регистрации',
      html: `
            <a href="${activationLink}">Активация аккаунта</a>
            <p>Code: ${token}</p>
            <p>Code ID: ${token_id}</p>
            <p>User ID: ${user_id}</p>
            <p>Activation key: ${key}</p>
          `
    });
  };
}

export default new Mail();
