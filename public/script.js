// Ganti dengan API key OpenWeatherMap dan Mapbox Token Anda!
const OPENWEATHERMAP_API_KEY = '3b30547ecf9d733dd7d3889e7ce49962';
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
  // Jika belum login dan menu selain beranda, tampilkan alert
  const op = getLoginSession();
  if (!op && id !== 'beranda') {
    alert('Silakan login terlebih dahulu untuk mengakses fitur ini.');
    return;
  }
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
// ============ Tambah Operator Dummy Jika Belum Ada ===========
(function(){
  let opers = JSON.parse(localStorage.getItem('operatorList')||'[]');
  if (!opers.find(o=>o.kode_operator==='OP-NSAIS08123456')) {
    opers.push({
      kode_operator: 'OP-NSAIS08123456',
      nama: 'Operator Dummy',
      ktp: '1234567890123456',
      kontak: '081234567890',
      email: 'dummy@operator.com',
      password: '123456'
    });
    localStorage.setItem('operatorList', JSON.stringify(opers));
  }
})();

// ============ SESSION LOGIN HANDLING ===========
function setLoginSession(operator) {
  sessionStorage.setItem('loginOperator', JSON.stringify(operator));
}
function getLoginSession() {
  try {
    return JSON.parse(sessionStorage.getItem('loginOperator'));
  } catch { return null; }
}
function clearLoginSession() {
  sessionStorage.removeItem('loginOperator');
}

// ============ UI LOGIN/LOGOUT & MENU FITUR ===========
function updateLoginUI() {
  const op = getLoginSession();
  // Selalu tampilkan semua tombol menu
  document.querySelectorAll('nav button:not([onclick*="showSection(\'beranda\')"])').forEach(btn => {
    btn.style.display = '';
    // Jika belum login, disable tombol selain beranda
    if (!op) {
      btn.disabled = true;
      btn.classList.add('nav-disabled');
      btn.title = 'Login diperlukan';
    } else {
      btn.disabled = false;
      btn.classList.remove('nav-disabled');
      btn.title = '';
    }
  });
  // Tambahkan tombol logout jika sudah login, hapus jika belum
  let nav = document.querySelector('nav');
  let logoutBtn = document.getElementById('btn-logout');
  if (op && !logoutBtn) {
    let btn = document.createElement('button');
    btn.id = 'btn-logout';
    btn.textContent = 'Logout';
    btn.onclick = function() {
      clearLoginSession();
      updateLoginUI();
      showSection('beranda');
    };
    nav.appendChild(btn);
  } else if (!op && logoutBtn) {
    logoutBtn.remove();
  }
}

// Tambahkan CSS agar tombol disabled tampak tidak aktif
document.addEventListener('DOMContentLoaded', function() {
  updateLoginUI();
  // Tambah style jika belum ada
  if (!document.getElementById('nav-disabled-style')) {
    const style = document.createElement('style');
    style.id = 'nav-disabled-style';
    style.textContent = `
      nav button.nav-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: auto;
      }
      nav button.nav-disabled:active {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }
});


// ============ MODAL LOGIN/REG/LUPA ===========
function showAuthForm(type) {
  if(type==='registrasi') document.getElementById('modal-registrasi').style.display='block';
  if(type==='login') document.getElementById('modal-login').style.display='block';
  if(type==='lupa') {
    document.getElementById('modal-login').style.display='none';
    document.getElementById('modal-lupa').style.display='block';
  }
}
function closeAuthForm(type) {
  if(type==='registrasi') document.getElementById('modal-registrasi').style.display='none';
  if(type==='login') document.getElementById('modal-login').style.display='none';
  if(type==='lupa') document.getElementById('modal-lupa').style.display='none';
}
window.onclick = function(event) {
  ['modal-registrasi','modal-login','modal-lupa'].forEach(id=>{
    const modal=document.getElementById(id);
    if(event.target===modal) modal.style.display='none';
  });
}

// ============ LOGIC REGISTRASI, LOGIN, LUPA ===========
function random6digit() {
  return Math.floor(100000 + Math.random()*900000).toString();
}
function generateKodeOperator() {
  return 'OP-NSAIS08' + random6digit();
}
function acak3angkaKontak(nokontak) {
  if (!nokontak) return '000';
  const angka = nokontak.replace(/\D/g,"");
  if (angka.length < 6) return angka.slice(-3);
  const idx = Math.floor(Math.random()*(angka.length-3));
  return angka.slice(idx, idx+3);
}
function getOperatorByKode(kode) {
  const arr = getLS('operatorList');
  return arr.find(op => op.kode_operator === kode);
}
function getOperatorByEmail(email) {
  const arr = getLS('operatorList');
  return arr.find(op => op.email.toLowerCase() === email.toLowerCase());
}

document.addEventListener('DOMContentLoaded', function(){

  updateLoginUI();

  // Registrasi
  const btnGenKode = document.getElementById('btn-generate-kode');
  const kodeInput = document.getElementById('kode_operator');
  if (btnGenKode && kodeInput) {
    btnGenKode.onclick = function() {
      kodeInput.value = generateKodeOperator();
    };
  }
  const regForm = document.getElementById('form-registrasi');
  if (regForm) {
    regForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const f = regForm;
      const kode = f.kode_operator.value.trim();
      const nama = f.nama.value.trim();
      const ktp = f.ktp.value.trim();
      const kontak = f.kontak.value.trim();
      const email = f.email.value.trim();
      const pass = f.password.value;
      const konfirmasi = f.konfirmasi.value;
      const notif = document.getElementById('notif-registrasi');
      notif.innerHTML = '';
      if (!kode || kode.length < 17) {
        notif.innerHTML = '<span style="color:red">ID Operator belum digenerate!</span>'; return;
      }
      if (getOperatorByKode(kode)) {
        notif.innerHTML = '<span style="color:red">ID Operator sudah terdaftar!</span>'; return;
      }
      if (getOperatorByEmail(email)) {
        notif.innerHTML = '<span style="color:red">Email sudah terdaftar!</span>'; return;
      }
      if (pass !== konfirmasi) {
        notif.innerHTML = '<span style="color:red">Konfirmasi password tidak cocok!</span>'; return;
      }
      if (ktp.length !== 16 || !/^\d+$/.test(ktp)) {
        notif.innerHTML = '<span style="color:red">No KTP harus 16 digit angka!</span>'; return;
      }
      if (kontak.length < 8) {
        notif.innerHTML = '<span style="color:red">No Kontak minimal 8 digit!</span>'; return;
      }
      let arr = getLS('operatorList');
      arr.push({
        kode_operator: kode,
        nama, ktp, kontak, email, password: pass
      });
      setLS('operatorList', arr);
      notif.innerHTML = '<span style="color:green">Registrasi berhasil, silakan login!</span>';
      regForm.reset();
      kodeInput.value = '';
      updateLoginUI();
    });
  }

  // Login
  const loginForm = document.getElementById('form-login');
  const loginValidasiInfo = document.getElementById('login-validasi-info');
  let loginValidasiKode = '';
  if (loginForm && loginValidasiInfo) {
    loginForm.kode_operator.onblur = function() {
      const kode = loginForm.kode_operator.value.trim();
      const op = getOperatorByKode(kode);
      if (op) {
        loginValidasiKode = acak3angkaKontak(op.kontak);
        loginValidasiInfo.innerHTML = `Masukkan <b>3 digit ini</b> dari nomor kontak operator: <span style="font-family:monospace">${loginValidasiKode}</span>`;
      } else {
        loginValidasiInfo.textContent = '';
        loginValidasiKode = '';
      }
    };
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const kode = loginForm.kode_operator.value.trim();
      const pass = loginForm.password.value;
      const validasi = loginForm.validasi.value;
      const notif = document.getElementById('notif-login');
      const op = getOperatorByKode(kode);
      if (!op) {
        notif.innerHTML = '<span style="color:red">ID Operator tidak ditemukan!</span>'; return;
      }
      if (op.password !== pass) {
        notif.innerHTML = '<span style="color:red">Password salah!</span>'; return;
      }
      if (acak3angkaKontak(op.kontak) !== validasi) {
        notif.innerHTML = '<span style="color:red">Validasi 3 angka salah!</span>'; return;
      }
      notif.innerHTML = '<span style="color:green">Login sukses! Selamat datang, '+op.nama+'</span>';
      setLoginSession(op);
      updateLoginUI();
      closeAuthForm('login');
      showSection('pemetaan');
    });
  }

  // Lupa password
  const lupaCard = document.getElementById('modal-lupa');
  const lupaForm = document.getElementById('form-lupa-password');
  const lupaValidasiInfo = document.getElementById('lupa-validasi-info');
  if (lupaForm && lupaValidasiInfo) {
    lupaForm.email.onblur = function() {
      const email = lupaForm.email.value.trim();
      const op = getOperatorByEmail(email);
      if (op) {
        lupaValidasiInfo.innerHTML = `Masukkan <b>3 digit ini</b> dari nomor kontak operator: <span style="font-family:monospace">${acak3angkaKontak(op.kontak)}</span>`;
      } else {
        lupaValidasiInfo.textContent = '';
      }
    };
    lupaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = lupaForm.email.value.trim();
      const validasi = lupaForm.validasi.value;
      const notif = document.getElementById('notif-lupa');
      const op = getOperatorByEmail(email);
      if (!op) {
        notif.innerHTML = '<span style="color:red">Email tidak ditemukan!</span>'; return;
      }
      if (acak3angkaKontak(op.kontak) !== validasi) {
        notif.innerHTML = '<span style="color:red">Validasi 3 angka salah!</span>'; return;
      }
      notif.innerHTML = '<span style="color:green">Permintaan reset password telah dikirim ke email operator.<br>Silakan cek email untuk instruksi reset (simulasi).</span>';
      lupaForm.reset();
      lupaValidasiInfo.textContent = '';
      setTimeout(()=>{ if(lupaCard) lupaCard.style.display='none'; }, 2500);
    });
  }
});
