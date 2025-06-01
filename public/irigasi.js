// public/irigasi.js
// Tambahkan logika irigasi jika ada
// Data simulasi sensor blok
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('irigasi-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      document.getElementById('irigasi-info').textContent = "Pengaturan otomatisasi irigasi berhasil disimpan!";
      document.getElementById('irigasi-warning').textContent = "";
    });
  }
});

let blokDebitLevel = {
    1: {level: 65, data: [60, 65, 55, 80, 70, 58, 67]},
    2: {level: 35, data: [40, 35, 30, 38, 42, 37, 36]}
};

// Warning handler
function checkDebitWarning(blok, level) {
    const warningDiv = document.getElementById('irigasi-warning');
    warningDiv.innerHTML = '';
    if (level <= 20) {
        warningDiv.innerHTML = '⚠️ <b>PERINGATAN:</b> Level air blok ' + blok + ' tersisa 20% atau kurang!';
    } else if (level >= 85) {
        warningDiv.innerHTML = '⚠️ <b>PERINGATAN:</b> Level air blok ' + blok + ' melebihi 85%! Matikan aliran air!';
    }
}

// Render grafik debit air per blok
function renderDebitChart(blok) {
    const ctx = document.getElementById('debitChart').getContext('2d');
    if (window.debitChartObj) window.debitChartObj.destroy();
    window.debitChartObj = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'],
            datasets: [{
                label: 'Level Debit Air (%)',
                data: blokDebitLevel[blok]?.data || [],
                backgroundColor: 'rgba(67,160,71,0.18)',
                borderColor: '#e53935',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: '#43a047',
                pointRadius: 6,
                pointHoverRadius: 9
            }]
        },
        options: {
            responsive:true,
            plugins: {
                legend: {display: false},
                title: {
                    display: true,
                    text: 'Grafik Debit Air Blok ' + blok,
                    font: {size: 16}
                }
            },
            scales: {
                y: {
                    min: 0, max: 100, beginAtZero: true,
                    grid: {color: "#e0e0e0"},
                    title: {display:true, text:"Persentase (%)"}
                },
                x: {
                    grid: {color: "#f0f0f0"}
                }
            }
        }
    });
}

// Handler form irigasi
document.addEventListener('DOMContentLoaded', function () {
    const irigasiForm = document.getElementById('irigasi-form');
    const infoDiv = document.getElementById('irigasi-info');
    if (irigasiForm) {
        irigasiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fd = new FormData(irigasiForm);
            const kode = fd.get('kode_lokasi');
            const blok = fd.get('nomor_blok');
            const pintu = fd.get('nomor_pintu');
            const hari = fd.get('hari');
            const mulai = fd.get('jam_mulai');
            const selesai = fd.get('jam_selesai');
            const debit = fd.get('debit_air');
            infoDiv.innerHTML = `
                <div>
                    <b>Kode Lokasi:</b> ${kode} | <b>Blok:</b> ${blok} | <b>Pintu:</b> ${pintu}<br>
                    <b>Pengairan:</b> ${hari}, ${mulai} - ${selesai}<br>
                    <b>Debit Air/Periode:</b> ${debit} liter
                </div>
            `;
            // Simulasi sensor
            const currentLevel = blokDebitLevel[blok]?.level || Math.floor(Math.random()*80)+10;
            blokDebitLevel[blok] = blokDebitLevel[blok] || {level: currentLevel, data:[]};
            blokDebitLevel[blok].level = currentLevel;
            blokDebitLevel[blok].data = blokDebitLevel[blok].data || [];
            blokDebitLevel[blok].data.push(currentLevel);
            if (blokDebitLevel[blok].data.length > 7) blokDebitLevel[blok].data.shift();
            checkDebitWarning(blok, currentLevel);
            renderDebitChart(blok);
        });
    }
    // Inisialisasi grafik & warning awal
    renderDebitChart(1);
    checkDebitWarning(1, blokDebitLevel[1].level);
});

// Simulasi sensor: update chart tiap 10 detik
setInterval(() => {
    const blok = Object.keys(blokDebitLevel).sort((a,b) => +b - +a)[0] || 1;
    if (!blok) return;
    const last = blokDebitLevel[blok].data[blokDebitLevel[blok].data.length-1] || 60;
    let next = last + (Math.random()*14-7); // random naik turun
    next = Math.max(0, Math.min(100, Math.round(next)));
    blokDebitLevel[blok].data.push(next);
    if (blokDebitLevel[blok].data.length > 7) blokDebitLevel[blok].data.shift();
    blokDebitLevel[blok].level = next;
    renderDebitChart(blok);
    checkDebitWarning(blok, next);
}, 10000);
