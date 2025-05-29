let map, userPosition;

// Gera um ID único para o usuário e salva no localStorage se não existir
function getMyUserId() {
  let id = localStorage.getItem("myUserId");
  if (!id) {
    id = Math.random().toString(36).substring(2);
    localStorage.setItem("myUserId", id);
  }
  return id;
}

window.initMap = function () {
  navigator.geolocation.getCurrentPosition(pos => {
    userPosition = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
    map = new google.maps.Map(document.getElementById("map"), {
      center: userPosition,
      zoom: 16
    });
    new google.maps.Marker({ position: userPosition, map, title: "Você está aqui" });
    carregarDenuncias();
  }, () => {
    alert("Não foi possível obter sua localização.");
  });
};

// Carrega todas as denúncias no mapa
function carregarDenuncias() {
  db.collection("denuncias").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      var lat = Number(data.lat);
      var lng = Number(data.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          title: data.tipo || "Denúncia"
        });
      }
    });
  });
}

// Carrega as denúncias do usuário na aba "Minhas denúncias"
function carregarMinhasDenuncias() {
  const minhasDenunciasDiv = document.getElementById("minhasDenuncias");
  const myUserId = getMyUserId();
  minhasDenunciasDiv.innerHTML = "<p>Testando...</p>";

  db.collection("denuncias")
    .where("userId", "==", myUserId)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        minhasDenunciasDiv.innerHTML = "<p>Nenhuma denúncia encontrada para o seu ID.</p>";
        return;
      }

      minhasDenunciasDiv.innerHTML = `<p>Denúncias encontradas: ${snapshot.size}</p>`;
    })
    .catch(error => {
      minhasDenunciasDiv.innerHTML = `<p>Erro: ${error.message}</p>`;
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        alert("Latitude: " + position.coords.latitude + "\nLongitude: " + position.coords.longitude);
      },
      function(error) {
        alert("Erro ao obter localização: " + error.message);
        console.log(error);
      }
    );
  } else {
    alert("Geolocalização não suportada pelo navegador.");
  }
}

// Abrir o pop-up
document.getElementById('denunciarBtn').onclick = function () {
  document.getElementById('popupDenuncia').classList.add('active');
};

// Fechar o pop-up
function fecharPopupDenuncia() {
  document.getElementById('popupDenuncia').classList.remove('active');
}

// Botão de pânico
document.getElementById('panicoBtn').onclick = function () {
  if (!userPosition) return alert("Localização não encontrada!");
  db.collection("panico").add({
    lat: userPosition.lat,
    lng: userPosition.lng,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Alerta de pânico enviado!");
  }).catch(error => {
    alert("Erro ao enviar alerta de pânico: " + error.message);
  });
};

// Envio da denúncia: salva userId e localização atual
document.getElementById('formDenuncia').onsubmit = function (e) {
  e.preventDefault();
  const descricao = document.getElementById('descricao').value.trim();
  const userId = getMyUserId();

  if (!descricao) {
    alert("Por favor, escreva uma descrição.");
    return;
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    db.collection("denuncias").add({
      tipo: descricao,
      lat: lat,
      lng: lng,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userId: userId
    }).then(() => {
      fecharPopupDenuncia();
      alert("Denúncia enviada com sucesso!");
      document.getElementById('descricao').value = "";
    }).catch((error) => {
      alert("Erro ao enviar denúncia: " + error.message);
      console.error(error);
    });
  }, function (error) {
    alert("Erro ao obter localização: " + error.message);
    console.error(error);
  });
};

// Recarrega as denúncias do usuário ao clicar na aba
document.querySelector('[data-tab="tab-denuncias"]').addEventListener('click', carregarMinhasDenuncias);
