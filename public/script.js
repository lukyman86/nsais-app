// public/script.js
function showSection(id) {
  // Sembunyikan semua section utama
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  // Tampilkan section yang dipilih
  const section = document.getElementById(id);
  if (section) section.classList.remove('hidden');
}

// Navigasi antar section
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// Tampilkan section pertama secara default saat halaman dibuka
document.addEventListener('DOMContentLoaded', function() {
  showSection('pemetaan');
});
// ===== Mapbox Token =====
mapboxgl.accessToken = 'pk.eyJ1IjoibHVreTE2OCIsImEiOiJjbWJlNm05NHExZXJxMmpvcGhtcjVkMWNjIn0.3ywQt_67Tncnjeal0P_qLQ'; // Ganti dengan token Anda

let map;
let marker;

// DATA LOKASI (dummy array, simpan di JS memory saja)
let dataLokasi = [
  {
    koordinat: [-7.8014, 110.3671], // [lat, lng]
    lokasi: 'Yogyakarta Selatan, Sleman',
    luas: '120 Ha',
    blok: 4,
    jenis: 'Kelapa Sawit, Karet',
    penanggungJawab: 'Ibu Siti Rahmawati',
    ahli: 'Dr. Andi Prasetyo',
    karyawan: 38,
    waktuTanam: '2025-01-10',
    waktuPanen: '2025-10-15',
    kodeBibit: 'KB-001',
    jumlahBibit: 5000,
    kodePupuk: 'PUK-888',
    merekPupuk: 'SuperGrow',
    kebutuhanPupuk: '3 ton'
  }
];

function cariDataLokasi(lat, lng) {
  return dataLokasi.find(loc =>
    Math.abs(loc.koordinat[0] - lat) < 0.001 && Math.abs(loc.koordinat[1] - lng) < 0.001
  );
}

function tampilkanKeteranganLokasi(lat, lng) {
  const keterangan = document.getElementById('keterangan-lokasi');
  const formTambah = document.getElementById('form-tambah-lokasi');
  const notif = document.getElementById('notif-tambah');
  const data = cariDataLokasi(lat, lng);
  if (data) {
    keterangan.innerHTML = `
      <b>Lokasi Perkebunan:</b> ${data.lokasi}<br>
      <b>Luas Perkebunan:</b> ${data.luas}<br>
      <b>Jumlah Blok Perkebunan:</b> ${data.blok} blok<br>
      <b>Jenis Perkebunan:</b> ${data.jenis}<br>
      <b>Penanggung Jawab:</b> ${data.penanggungJawab}<br>
      <b>Tenaga Ahli Pendamping:</b> ${data.ahli}<br>
      <b>Jumlah Karyawan:</b> ${data.karyawan} orang<br>
      <b>Waktu Awal Tanam:</b> ${data.waktuTanam}<br>
      <b>Waktu Panen:</b> ${data.waktuPanen}<br>
      <b>Kode Bibit yang Ditanam:</b> ${data.kodeBibit}<br>
      <b>Jumlah Bibit yang Ditanam:</b> ${data.jumlahBibit}<br>
      <b>Kode Pupuk:</b> ${data.kodePupuk}<br>
      <b>Merek Pupuk:</b> ${data.merekPupuk}<br>
      <b>Jumlah Kebutuhan Pupuk Hingga Panen:</b> ${data.kebutuhanPupuk}
    `;
    formTambah.style.display = 'none';
    notif.innerHTML = '';
  } else {
    keterangan.innerHTML = `<i>Data lokasi tidak ditemukan. Silakan tambah data perkebunan baru di bawah ini.</i>`;
    formTambah.style.display = 'block';
    notif.innerHTML = '';
    // Isi hidden koordinat pada form tambah lokasi
    formTambah.lat.value = lat;
    formTambah.lng.value = lng;
  }
}

function initMap(center = [-7.8014, 110.3671]) {
  // Mapbox pakai [lng, lat]
  const mapboxCenter = [center[1], center[0]];
  if (map) {
    map.setCenter(mapboxCenter);
    map.setZoom(13);
    if (marker) marker.setLngLat(mapboxCenter);
    else marker = new mapboxgl.Marker().setLngLat(mapboxCenter).addTo(map);
    tampilkanKeteranganLokasi(center[0], center[1]);
    return;
  }
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: mapboxCenter,
    zoom: 13
  });
  marker = new mapboxgl.Marker().setLngLat(mapboxCenter).addTo(map);
  tampilkanKeteranganLokasi(center[0], center[1]);
}

// ========= Menu Navigation ==========
function showSection(id) {
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  const section = document.getElementById(id);
  if (section) section.classList.remove('hidden');
  if (id === 'pemetaan') {
    setTimeout(() => initMap(), 300);
  }
}

// ========= Form Koordinat & Tambah Baru ==========
document.addEventListener('DOMContentLoaded', function() {
  showSection('pemetaan');

  // Form cari lokasi
  const formCari = document.getElementById('form-cari-lokasi');
  const inputKoordinat = document.getElementById('input-koordinat');
  if (formCari) {
    formCari.addEventListener('submit', function(e) {
      e.preventDefault();
      const val = inputKoordinat.value.trim();
      const parts = val.split(',').map(s => s.trim());
      if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
        alert('Format koordinat salah. Contoh: -7.8014, 110.3671');
        return;
      }
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      initMap([lat, lng]);
    });
  }

  // Form tambah data lokasi baru
  const formTambah = document.getElementById('form-tambah-lokasi');
  if (formTambah) {
    formTambah.addEventListener('submit', function(e) {
      e.preventDefault();
      const f = formTambah;
      // Ambil value dari input
      const lat = parseFloat(f.lat.value);
      const lng = parseFloat(f.lng.value);
      const dataBaru = {
        koordinat: [lat, lng],
        lokasi: f.lokasi.value,
        luas: f.luas.value,
        blok: parseInt(f.blok.value),
        jenis: f.jenis.value,
        penanggungJawab: f.penanggungJawab.value,
        ahli: f.ahli.value,
        karyawan: parseInt(f.karyawan.value),
        waktuTanam: f.waktuTanam.value,
        waktuPanen: f.waktuPanen.value,
        kodeBibit: f.kodeBibit.value,
        jumlahBibit: parseInt(f.jumlahBibit.value),
        kodePupuk: f.kodePupuk.value,
        merekPupuk: f.merekPupuk.value,
        kebutuhanPupuk: f.kebutuhanPupuk.value
      };
      dataLokasi.push(dataBaru);
      tampilkanKeteranganLokasi(lat, lng);
      if (marker) marker.setLngLat([lng, lat]);
      formTambah.reset();
      formTambah.style.display = 'none';
      const notif = document.getElementById('notif-tambah');
      notif.innerHTML = `<span style="color:green">Data lokasi perkebunan berhasil ditambahkan!</span>`;
    });
  }
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
