window.onload = function () {
  const messageElement = document.querySelector(".message");
  const statusOrdemElements = document.querySelectorAll(".status-ordem");
  const ordens = require('../models/Ordem')

  if (messageElement) {
    setTimeout(function () {
      messageElement.style.display = "none";
    }, 3000);
  }

  statusOrdemElements.forEach((statusOrdem) => {

    const statusText = statusOrdem.innerHTML.trimEnd().toLowerCase()

    if (statusText === "aberto") {
      statusOrdem.innerHTML = "Aberto";
      statusOrdem.style.color = "#FFCA2C";
    } else if (statusText === "concluido") {
      statusOrdem.innerHTML = "Concluída";
      statusOrdem.style.color = "#55efc4";
    } else if (statusText === "entregue") {
      statusOrdem.innerHTML = "Entregue";
      statusOrdem.style.color = "#0D6EFD";
    }
  }); 

};
