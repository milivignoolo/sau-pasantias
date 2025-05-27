import nodemailer from 'nodemailer';

let transporter;

export async function initEmailTransporter() {
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log('Cuenta Ethereal creada. Usuario:', testAccount.user);
  console.log('Contraseña:', testAccount.pass);
}

export function getTransporter() {
  if (!transporter) {
    throw new Error('Transporter no inicializado. Ejecuta initEmailTransporter primero.');
  }
  return transporter;
}
