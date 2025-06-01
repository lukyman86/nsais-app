// Ganti dengan API key OpenWeatherMap dan Mapbox Token Anda!
const OPENWEATHERMAP_API_KEY = 'ISI_API_KEY_OPENWEATHERMAP';
mapboxgl.accessToken = 'pk.eyJ1IjoibHVreTE2OCIsImEiOiJjbWJlNm05NHExZXJxMmpvcGhtcjVkMWNjIn0.3ywQt_67Tncnjeal0P_qLQ';

// === Helper LocalStorage ===
function getLS(key, def=[]) {
  try {
    return JSON.parse(localStorage.getItem(key)) || def;
  } catch {
    return def;
  }
}
function setLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// === Navigasi ===
function showSection(id) {
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  const section = document.getElementById(id);
  if (section) section.classList.remove('hidden');
  if (id === 'pemetaan') {
    setTimeout(() => { if (typeof initMap === "function") initMap(); }, 300);
  }
  if (id === 'bibit') {
    tampilkanDaftarBibit();
  }
}
document.addEventListener('DOMContentLoaded', function() {
  showSection('beranda');
});

// ========== PEMETAAN & TOPOGRAFI ==========
let map, marker;

function cariDataLokasi(lat, lng, dataLokasi) {
  return dataLokasi.find(loc =>
    Math.abs(loc.koordinat[0] - lat) < 0.001 && Math.abs(loc.koordinat[1] - lng) < 0.001
  );
}

function tampilkanKeteranganLokasi(lat, lng) {
  const dataLokasi = getLS('lokasiPerkebunan');
  const keterangan = document.getElementById('keterangan-lokasi');
  const formTambah = document.getElementById('form-tambah-lokasi');
  const notif = document.getElementById('notif-tambah');
  const data = cariDataLokasi(lat, lng, dataLokasi);
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
    formTambah.lat.value = lat;
    formTambah.lng.value = lng;
  }
}

function initMap(center = [-7.8014, 110.3671]) {
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

document.addEventListener('DOMContentLoaded', function() {
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
      let dataLokasi = getLS('lokasiPerkebunan');
      dataLokasi.push(dataBaru);
      setLS('lokasiPerkebunan', dataLokasi);
      tampilkanKeteranganLokasi(lat, lng);
      if (marker) marker.setLngLat([lng, lat]);
      formTambah.reset();
      formTambah.style.display = 'none';
      const notif = document.getElementById('notif-tambah');
      notif.innerHTML = `<span style="color:green">Data lokasi perkebunan berhasil disimpan!</span>`;
    });
  }
});

// ========== CUACA ==========
function fetchCuaca() {
  const city = document.getElementById('city').value.trim();
  const hasil = document.getElementById('cuacaHasil');
  if (!city) {
    hasil.innerHTML = "<span style='color:red'>Silakan masukkan nama kota.</span>";
    return;
  }
  hasil.innerHTML = "Memuat data cuaca...";
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=id`)
    .then(resp => {
      if (!resp.ok) throw new Error("Kota tidak ditemukan!");
      return resp.json();
    })
    .then(data => {
      hasil.innerHTML = `
        <b>Cuaca di ${data.name}</b><br>
        Suhu: ${data.main.temp} °C<br>
        Kelembapan: ${data.main.humidity}%<br>
        Kondisi: ${data.weather[0].description}<br>
        Angin: ${data.wind.speed} m/s
      `;
    })
    .catch(err => {
      hasil.innerHTML = `<span style='color:red'>${err.message}</span>`;
    });
}

// ========== BIBIT & PEMANTAUAN ==========
function tampilkanDaftarBibit() {
  const data = getLS('dataBibit');
  const el = document.getElementById('daftar-bibit');
  if (!data.length) {
    el.innerHTML = `<em>Belum ada data bibit tersimpan.</em>`;
    return;
  }
  let html = `<h3>Riwayat Data Bibit & Pemantauan</h3><table class="tabel-bibit"><thead>
      <tr>
        <th>Kode</th><th>Merek</th><th>Distributor</th><th>Jumlah</th>
        <th>Lokasi</th><th>Tanam</th><th>Panen</th><th>Pupuk/Bibit</th>
        <th>Nutrisi</th><th>Siklus</th><th>Pemantauan</th>
        <th>Kendala</th><th>Solusi</th><th>Metode</th>
        <th>Ahli</th><th>Penanggung Jawab</th>
      </tr></thead><tbody>`;
  for (const b of data) {
    html += `<tr>
      <td>${b.kode_bibit}</td>
      <td>${b.merek_bibit}</td>
      <td>${b.distributor}</td>
      <td>${b.jumlah_bibit}</td>
      <td>${b.lokasi_perkebunan}</td>
      <td>${b.waktu_tanam}</td>
      <td>${b.waktu_panen}</td>
      <td>${b.takaran_pupuk}</td>
      <td>${b.nutrisi_tambahan}</td>
      <td>${b.siklus_pemupukan}</td>
      <td><pre>${b.keterangan_pemantauan}</pre></td>
      <td>${b.kendala}</td>
      <td>${b.solusi}</td>
      <td>${b.metode}</td>
      <td>${b.tenaga_ahli}</td>
      <td>${b.penanggung_jawab}</td>
    </tr>`;
  }
  html += "</tbody></table>";
  el.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  const bibitForm = document.getElementById('bibit-form');
  if (bibitForm) {
    bibitForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const f = bibitForm;
      const dataBaru = {
        kode_bibit: f.kode_bibit.value,
        merek_bibit: f.merek_bibit.value,
        distributor: f.distributor.value,
        jumlah_bibit: f.jumlah_bibit.value,
        lokasi_perkebunan: f.lokasi_perkebunan.value,
        waktu_tanam: f.waktu_tanam.value,
        waktu_panen: f.waktu_panen.value,
        takaran_pupuk: f.takaran_pupuk.value,
        nutrisi_tambahan: f.nutrisi_tambahan.value,
        siklus_pemupukan: f.siklus_pemupukan.value,
        keterangan_pemantauan: f.keterangan_pemantauan.value,
        kendala: f.kendala.value,
        solusi: f.solusi.value,
        metode: f.metode.value,
        tenaga_ahli: f.tenaga_ahli.value,
        penanggung_jawab: f.penanggung_jawab.value
      };
      let data = getLS('dataBibit');
      data.push(dataBaru);
      setLS('dataBibit', data);
      document.getElementById('hasil-bibit').innerHTML = `
        <div style="background:#e3fbe6; padding:1rem 1.5rem; border-radius:9px; box-shadow:0 2px 8px #43a04715;">
          <b>Data Bibit & Pemantauan berhasil disimpan!</b>
        </div>
      `;
      bibitForm.reset();
      tampilkanDaftarBibit();
    });
  }
  tampilkanDaftarBibit();
});
