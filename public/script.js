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
4
// Tangkap form dan tampilkan hasil
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bibit-form');
    const hasil = document.getElementById('hasil-bibit');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {};
            Array.from(form.elements).forEach(el => {
                if (el.name) data[el.name] = el.value;
            });
            // Simpan ke localStorage (atau bisa ganti dengan POST ke backend)
            let bibitData = JSON.parse(localStorage.getItem('bibitData') || '[]');
            bibitData.push(data);
            localStorage.setItem('bibitData', JSON.stringify(bibitData));

            // Tampilkan hasil input
            hasil.innerHTML = `
                <h4>Data Berhasil Disimpan!</h4>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
            form.reset();
        });
    }
});
