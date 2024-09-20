document.addEventListener("DOMContentLoaded", function () {
    let currentStyle = 1;
    const mainContainer = document.querySelector(".container");
  
    function applyStyle(styleNumber) {
      mainContainer.classList.remove("estilo1", "estilo2", "estilo3");
  
      mainContainer.classList.add(`estilo${styleNumber}`);
    }
  
    setInterval(() => {
      currentStyle = currentStyle % 3 + 1;
      applyStyle(currentStyle);
    }, 5000);
  });
  