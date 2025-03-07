function sendWhatsAppMessage(phone, message) {
  
  const encodedMessage = encodeURIComponent(message);
  
  // abrir o WhatsApp desktop
  const desktopUrl = `whatsapp://send?phone=55${phone}&text=${encodedMessage}`;
  
  // const webUrl = `https://wa.me/55${phone}?text=${encodedMessage}`;
  return { desktopUrl };
}


module.exports = { sendWhatsAppMessage };
