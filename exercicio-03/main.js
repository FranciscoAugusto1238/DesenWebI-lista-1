const form = document.getElementById('image-form');
const imageGrid = document.getElementById('image-grid');

function generateImageUrl(width, height, seed = Date.now()) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}.webp`;
}

function displayImages(width, height, quantity) {
    imageGrid.innerHTML = '';
    for (let i = 0; i < quantity; i++) {
      const imgUrl = generateImageUrl(width, height, i);
      
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
  
      const imgElement = document.createElement('img');
      imgElement.src = imgUrl;
      imgElement.alt = `Imagem aleatória com largura de ${width}px e altura de ${height}px`;
  
      const actions = document.createElement('div');
      actions.classList.add('actions');
  
      const downloadLink = document.createElement('a');
      downloadLink.href = imgUrl;
      downloadLink.download = `imagem_fullhd_${i}.webp`;
      downloadLink.innerHTML = '<i class="fas fa-download"></i>';
      downloadLink.setAttribute('aria-label', 'Baixar imagem em Full HD');
  
      const copyButton = document.createElement('button');
      copyButton.innerHTML = '<i class="fas fa-copy"></i>';
      copyButton.setAttribute('aria-label', 'Copiar link da imagem');
      copyButton.addEventListener('click', () => copyToClipboard(imgUrl));
  
      const shareLink = document.createElement('a');
      const shareUrl = `https://api.whatsapp.com/send?text=Confira esta imagem: ${imgUrl}`;
      shareLink.href = shareUrl;
      shareLink.target = '_blank';
      shareLink.innerHTML = '<i class="fas fa-share-alt"></i>';
      shareLink.setAttribute('aria-label', 'Compartilhar imagem no WhatsApp');
  
      actions.append(downloadLink, copyButton, shareLink);
      imageContainer.append(imgElement, actions);
      imageGrid.appendChild(imageContainer);
    }
  }  

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => alert('Link copiado para a área de transferência!'),
    (err) => alert('Falha ao copiar o link!')
  );
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const width = parseInt(document.getElementById('width').value);
  const height = parseInt(document.getElementById('height').value);
  const quantity = parseInt(document.getElementById('quantity').value);

  if (width < 100 || width > 1920 || height < 100 || height > 1080) {
    alert('A largura deve ser entre 100px e 1920px, e a altura entre 100px e 1080px.');
    return;
  }

  displayImages(width, height, quantity);
});
