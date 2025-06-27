// Charger les variables d'environnement
require('dotenv').config();
const nodemailer = require('nodemailer');
const path = require('path');

const sendEmailWithAttachment = async (recipientEmail, filePath) => {
  // Création d'un transporteur
  const transporter = nodemailer.createTransport({
    service: 'gmail', // ou un autre service SMTP si nécessaire
    auth: {
      user: process.env.EMAIL, // Utiliser l'email depuis le fichier .env
      pass: process.env.EMAIL_PASSWORD, // Utiliser le mot de passe ou le mot de passe d'application depuis le fichier .env
    },
  });

  // Configuration du message
  const mailOptions = {
    from: `"Formulaire Contact" <${process.env.EMAIL}>`, // L'email de l'expéditeur
    to: recipientEmail, // L'email du destinataire
    subject: 'Devis de projet soumis',
    text: 'Bonjour, veuillez trouver ci-joint le devis pour votre projet.',
    attachments: [
      {
        filename: path.basename(filePath),
        path: filePath, // Le chemin du fichier PDF généré
      },
    ],
  };

  // Envoi de l'email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès!');
  } catch (err) {
    console.error('Erreur lors de l\'envoi de l\'email :', err);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

module.exports = sendEmailWithAttachment;
