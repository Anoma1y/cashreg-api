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
    if (Config.debug) {
      console.log(message)
    }

    return this.transporter.sendMail({
      ...mailConfig.defaultMessage,
      ...message,
    })
  };
}

export default new Mail();
