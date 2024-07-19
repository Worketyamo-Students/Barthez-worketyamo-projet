import nodemailer from 'nodemailer'
import { account } from '../core/config/env';

const sendmail = (email: string, text: string) => {
    //Configuration de l'objet transporteur
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: account.USER,
            pass: account.PASS,
        },
    });

    // Configurer les données de l'envoi du message
    const mailData = {
        from: account.USER,
        to: email,
        subject: "Votre code à usage unique",
        html: text,
    };

    //Envoir du message
    transporter.sendMail(mailData, (err, infoMsg) => {
        if(err) return console.error(`Une erreur a survenu lors du traitement: ${err}`);
        return console.log(`Email envoyé avec succès: ${infoMsg.response}`);
    })
}

export default sendmail;
