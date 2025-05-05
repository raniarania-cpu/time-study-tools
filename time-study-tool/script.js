// Fungsi untuk menambah baris pada tabel
function tambahBaris() {
  const tbody = document.getElementById("inputTable").getElementsByTagName("tbody")[0];
  const newRow = document.createElement("tr");

  // Kolom input untuk Nama, Proses, CT, dan kolom perhitungan lainnya
  const namaCell = document.createElement("td");
  const prosesCell = document.createElement("td");
  const ctCell = document.createElement("td");
  const ctAllwCell = document.createElement("td");
  const kapasitasCell = document.createElement("td");
  const aksiCell = document.createElement("td");

  namaCell.innerHTML = '<input type="text" placeholder="Nama" />';
  prosesCell.innerHTML = '<input type="text" placeholder="Proses" />';
  ctCell.innerHTML = '<input type="number" placeholder="CT (detik)" onchange="hitungBaris(this)" />';
  ctAllwCell.innerHTML = '<input type="number" placeholder="CT + Allowance" readonly />';
  kapasitasCell.innerHTML = '<input type="number" placeholder="Jumlah Kapasitas / Hari (8 Jam)" readonly />';
  aksiCell.innerHTML = '<button onclick="hapusBaris(this)">Hapus</button>';

  // Menambahkan kolom ke baris
  newRow.appendChild(namaCell);
  newRow.appendChild(prosesCell);
  newRow.appendChild(ctCell);
  newRow.appendChild(ctAllwCell);
  newRow.appendChild(kapasitasCell);
  newRow.appendChild(aksiCell);

  // Menambahkan baris ke tabel
  tbody.appendChild(newRow);
}

// Fungsi untuk menghapus baris
function hapusBaris(button) {
  const row = button.closest("tr");
  row.remove(); // Menghapus baris
}

// Fungsi untuk menghitung CT + Allowance dan kapasitas per hari
function hitungBaris(input) {
  const row = input.closest("tr");

  // Ambil nilai dari CT (detik) dan global Allowance
  const ct = parseFloat(row.cells[2].querySelector('input').value);
  const allowance = parseFloat(document.getElementById('globalAllowance').value);

  // Jika nilai CT dan Allowance valid, hitung nilai lainnya
  if (!isNaN(ct) && !isNaN(allowance)) {
    // Hitung CT + Allowance
    const ctAllw = ct * (1 + allowance / 100);
    row.cells[3].querySelector('input').value = ctAllw.toFixed(2);

    // Hitung kapasitas per hari (8 Jam)
    const kapasitas = (8 * 60 * 60) / ctAllw; // 8 jam = 28800 detik
    row.cells[4].querySelector('input').value = kapasitas.toFixed(0);
  } else {
    // Jika CT atau Allowance tidak valid, kosongkan kolom lainnya
    row.cells[3].querySelector('input').value = '';
    row.cells[4].querySelector('input').value = '';
  }
}

// Fungsi untuk menghitung jumlah kapasitas per proses
function jumlahkanKapasitas() {
  const rows = document.getElementById("inputTable").getElementsByTagName("tbody")[0].rows;
  const kapasitasPerProses = {};

  // Loop untuk menghitung kapasitas per proses
  for (let i = 0; i < rows.length; i++) {
    const proses = rows[i].cells[1].querySelector('input').value;
    const kapasitas = parseFloat(rows[i].cells[4].querySelector('input').value);

    if (!isNaN(kapasitas) && proses) {
      if (!kapasitasPerProses[proses]) {
        kapasitasPerProses[proses] = 0;
      }
      kapasitasPerProses[proses] += kapasitas; // Menjumlahkan kapasitas per proses
    }
  }

  // Menyortir hasil berdasarkan nama proses
  const sortedProses = Object.keys(kapasitasPerProses).sort();

  // Tampilkan hasil per proses
  let rekapHTML = "<ul>";
  sortedProses.forEach(function(proses) {
    rekapHTML += `<li><strong>${proses}</strong>: ${kapasitasPerProses[proses].toFixed(0)} unit</li>`;
  });
  rekapHTML += "</ul>";

  document.getElementById('rekapProses').innerHTML = rekapHTML;
}
