const nodemailer = require('nodemailer');
const dns = require('dns');

// El `family: 4` del transporter de abajo no alcanza por sí solo: en
// algunos hostings (Render incluido) Node resuelve el DNS de
// smtp.gmail.com ANTES de que nodemailer pueda forzar la familia de la
// conexión, y termina intentando la IPv6 igual (que no tiene salida de
// red ahí, de ahí el ENETUNREACH/ESOCKET).
//
// Esto cambia el ORDEN DE RESOLUCIÓN DNS a nivel de todo el proceso de
// Node: cuando el hostname tiene tanto registro A (IPv4) como AAAA
// (IPv6), prueba primero la IPv4. Requiere Node 18+.
dns.setDefaultResultOrder('ipv4first');

// Envío simple vía Gmail usando una "contraseña de aplicación"
// (myaccount.google.com/apppasswords). No requiere OAuth ni Google Cloud
// Console — solo que la cuenta tenga verificación en 2 pasos activada.
//
// Variables de entorno necesarias:
//   GMAIL_USER           -> la cuenta de Gmail que envía (ej. notificaciones@gmail.com)
//   GMAIL_APP_PASSWORD   -> la contraseña de aplicación de 16 caracteres
//   GMAIL_DESTINO        -> (opcional) a dónde llega el aviso; si no se define, se manda a GMAIL_USER
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4,
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