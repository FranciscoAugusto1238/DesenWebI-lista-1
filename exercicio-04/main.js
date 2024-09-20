let currentPhotoData = null;
let currentLocation = null;
let photoId = 0;
const localStorageKey = 'photoData';

const videoElement = document.getElementById('camera');
const canvasElement = document.getElementById('photo-canvas');
const photoPreview = document.getElementById('photo-preview');
const photoList = document.querySelector('#photo-table tbody');

document.getElementById('capture-button').addEventListener('click', () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
        }).catch(() => {
            alert('Câmera não disponível, por favor faça o upload de uma imagem.');
            document.getElementById('upload-input').style.display = 'block';
        });
    }
});

document.getElementById('upload-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentPhotoData = e.target.result;
            photoPreview.src = currentPhotoData;
            photoPreview.style.display = 'block';
            videoElement.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('capture-button').addEventListener('click', () => {
    if (videoElement.srcObject) {
        const context = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0);
        currentPhotoData = canvasElement.toDataURL('image/png');
        photoPreview.src = currentPhotoData;
        photoPreview.style.display = 'block';
        videoElement.style.display = 'none';
    }
});

document.getElementById('location-button').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            showMap(currentLocation, 'map');
        }, () => {
            alert('Não foi possível acessar o GPS. Informe a localização manualmente.');
            document.getElementById('manual-location').style.display = 'block';
        });
    }
});

function showMap(location, mapId) {
    const map = L.map(mapId).setView([location.lat, location.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([location.lat, location.lng]).addTo(map);
}

document.getElementById('save-button').addEventListener('click', () => {
    if (!currentPhotoData || !currentLocation) {
        alert('Capture uma foto e marque a localização.');
        return;
    }

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value || 'Sem descrição';

    if (!title) {
        alert('O título é obrigatório.');
        return;
    }

    const photo = {
        id: ++photoId,
        title,
        description,
        photo: currentPhotoData,
        location: currentLocation,
        date: new Date().toLocaleString()
    };

    savePhoto(photo);
    displayPhotoInTable(photo);
    clearForm();
});

function savePhoto(photo) {
    const storedPhotos = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    storedPhotos.push(photo);
    localStorage.setItem(localStorageKey, JSON.stringify(storedPhotos));
}

function displayPhotoInTable(photo) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${photo.id}</td>
        <td>${photo.title}</td>
        <td>${photo.description}</td>
        <td>${photo.location.lat}, ${photo.location.lng}</td>
        <td>${photo.date}</td>
        <td>
            <button class="view-button" data-id="${photo.id}">Ver</button>
            <button class="delete-button" data-id="${photo.id}">Excluir</button>
        </td>
    `;
    photoList.appendChild(row);
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('photo-preview').style.display = 'none';
    document.getElementById('manual-location').style.display = 'none';
    currentPhotoData = null;
    currentLocation = null;
    document.getElementById('map').innerHTML = '';
}

document.querySelector('#photo-table').addEventListener('click', (event) => {
    if (event.target.classList.contains('view-button')) {
        const id = event.target.dataset.id;
        const photos = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        const photo = photos.find(p => p.id == id);

        if (photo) {
            document.getElementById('modal-title').innerText = photo.title;
            document.getElementById('modal-description').innerText = photo.description;
            document.getElementById('modal-photo').src = photo.photo;
            document.getElementById('modal').style.display = 'flex';
            showMap(photo.location, 'modal-map');
        }
    } else if (event.target.classList.contains('delete-button')) {
        const id = event.target.dataset.id;
        let photos = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        photos = photos.filter(p => p.id != id);
        localStorage.setItem(localStorageKey, JSON.stringify(photos));
        event.target.closest('tr').remove();
    }
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});
