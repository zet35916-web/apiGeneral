const nodemailer = require('nodemailer');
const dns = require('dns').promises;

// El intento anterior (dns.setDefaultResultOrder('ipv4first')) solo
// REORDENA resultados cuando el lookup devuelve tanto IPv4 como IPv6.
// En Render, el lookup de smtp.gmail.com parece devolver únicamente la
// IPv6 en ese momento — no hay nada que reordenar, y la conexión sigue
// yéndose por una ruta sin salida de red (ENETUNREACH).
//
// Solución más directa: resolver explícitamente el registro A
// (dns.resolve4 SOLO pide IPv4, nunca AAAA) y conectarnos a esa IP
// numérica en vez de al hostname. Mantenemos `servername` en las
// opciones de TLS para que la verificación del certificado siga
// funcionando igual que si nos conectáramos por nombre.
let transporterPromise = null;

async function crearTransporter() {
  const direcciones = await dns.resolve4('smtp.gmail.com');
  const ip = direcciones[0];

  return nodemailer.createTransport({
    host: ip,
    port: 465,
    secure: true,
    tls: {
      servername: 'smtp.gmail.com', // necesario para que el certificado TLS valide correctamente al conectar por IP
    },
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// Se resuelve una sola vez y se reutiliza (la IP de Gmail no cambia
// tan seguido como para resolverla en cada envío). Si algo falla al
// crearlo, no dejamos la promesa rota cacheada para siempre — se
// reintenta desde cero en el próximo envío.
function obtenerTransporter() {
  if (!transporterPromise) {
    transporterPromise = crearTransporter().catch((err) => {
      transporterPromise = null;
      throw err;
    });
  }
  return transporterPromise;
}

async function enviarNotificacionContacto({ nombre, correo, mensaje }) {
  const transporter = await obtenerTransporter();
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
  const transporter = await obtenerTransporter();
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