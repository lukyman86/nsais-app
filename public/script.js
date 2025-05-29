function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

async function fetchCuaca() {
    const city = document.getElementById('city').value;
    const response = await fetch(`/api/cuaca?city=${city}`);
    const data = await response.json();
    if (data.error) {
        document.getElementById('cuacaHasil').innerText = "Gagal mengambil data cuaca.";
    } else {
        document.getElementById('cuacaHasil').innerHTML = `
            <h3>Cuaca di ${data.name}</h3>
            <p>Suhu: ${data.main.temp}°C</p>
            <p>Kelembaban: ${data.main.humidity}%</p>
            <p>Deskripsi: ${data.weather[0].description}</p>
        `;
    }
}
