document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('irigasi-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      document.getElementById('irigasi-info').textContent = "Pengaturan otomatisasi irigasi berhasil disimpan!";
      document.getElementById('irigasi-warning').textContent = "";
      // Contoh update Chart.js jika ingin menampilkan data debit air (dummy)
      if (window.Chart) {
        const ctx = document.getElementById('debitChart').getContext('2d');
        if (window.debitChartObj) window.debitChartObj.destroy();
        window.debitChartObj = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
            datasets: [{
              label: 'Debit Air (liter)',
              data: [120, 150, 100, 130, 140, 110, 90],
              backgroundColor: '#43a047'
            }]
          }
        });
      }
    });
  }
});
