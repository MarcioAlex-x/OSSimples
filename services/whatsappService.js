function sendWhatsAppMessage(phone, message) {
    const encodedMessage = encodeURIComponent(message);
  
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
    const desktopUrl = `whatsapp://send?phone=55${phone}&text=${encodedMessage}`;
    const webUrl = `https://wa.me/55${phone}?text=${encodedMessage}`;
  
    if (isMobile) {
      return { url: webUrl };
    } else {
      return { url: desktopUrl };
    }
  }
  
  module.exports = { sendWhatsAppMessage };
  