const nodemailer = require('nodemailer');

// Envío simple vía Gmail usando una "contraseña de aplicación"
// (myaccount.google.com/apppasswords). No requiere OAuth ni Google Cloud
// Console — solo que la cuenta tenga verificación en 2 pasos activada.
//
// Variables de entorno necesarias:
//   GMAIL_USER           -> la cuenta de Gmail que envía (ej. notificaciones@gmail.com)
//   GMAIL_APP_PASSWORD   -> la contraseña de aplicación de 16 caracteres
//   GMAIL_DESTINO        -> (opcional) a dónde llega el aviso; si no se define, se manda a GMAIL_USER
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function enviarNotificacionContacto({ nombre, correo, mensaje }) {
  await transporter.sendMail({
    from: `"Río Cristal - Web" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_DESTINO || process.env.GMAIL_USER,
    replyTo: correo, // así al responder el correo, le contestas directo al cliente
    subject: `Nuevo mensaje de contacto: ${nombre}`,
    text: `Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`,
  });
}

// Correo automático genérico de vuelta al cliente, solo para confirmar
// que su mensaje llegó. Sin ofertas ni contenido de marketing (eso es
// un feature aparte, no construido todavía) — es un acuse de recibo.
async function enviarConfirmacionCliente({ nombre, correo }) {
  await transporter.sendMail({
    from: `"Río Cristal Acuarios" <${process.env.GMAIL_USER}>`,
    to: correo,
    subject: 'Recibimos tu mensaje — Río Cristal Acuarios',
    text: `Hola ${nombre},

Gracias por escribirnos. Ya recibimos tu mensaje y te responderemos a más tardar en 24 horas hábiles, por correo o WhatsApp.

Si tu consulta es urgente, también puedes escribirnos directo por WhatsApp: +51 987 654 321.

Saludos,
Río Cristal Acuarios`,
  });
}

module.exports = { enviarNotificacionContacto, enviarConfirmacionCliente };