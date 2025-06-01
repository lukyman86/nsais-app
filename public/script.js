// Navigasi antar section
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// Slideshow header jika ada .slide-image (aman jika tidak ada)
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide-image');
    let currentSlide = 0;
    function showSlide(idx) {
        slides.forEach((img, i) => {
            img.style.opacity = (i === idx) ? '1' : '0';
        });
    }
    if (slides.length > 0) {
        showSlide(currentSlide);
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 3000);
    }
});

// public/script.js
function showSection(id) {
  // Sembunyikan semua section utama
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  // Tampilkan section yang dipilih
  const section = document.getElementById(id);
  if (section) section.classList.remove('hidden');
}

// Tampilkan section pertama secara default saat halaman dibuka
document.addEventListener('DOMContentLoaded', function() {
  showSection('pemetaan');
});

// Fungsi dummy cuaca, hujan, kelembapan
async function fetchCuaca() {
    const city = document.getElementById('city').value;
    try {
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
    } catch (err) {
        document.getElementById('cuacaHasil').innerText = "Gagal menghubungi server.";
    }
}
function fetchcurahhujan() {
    document.getElementById('curahhujan').innerHTML = "Data curah hujan belum tersedia.";
}
function fetchkelembapan() {
    document.getElementById('cekkelembapan').innerHTML = "Data kelembapan belum tersedia.";
}

// Form bibit & simpan ke localStorage
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
            let bibitData = JSON.parse(localStorage.getItem('bibitData') || '[]');
            bibitData.push(data);
            localStorage.setItem('bibitData', JSON.stringify(bibitData));
            hasil.innerHTML = `
                <h4>Data Berhasil Disimpan!</h4>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
            form.reset();
        });
    }
});
