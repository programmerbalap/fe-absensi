<template>
  <div class="modal fade" id="modal-laporan-absensi" tabindex="-1">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content container">
        <div class="modal-header">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <div>
            <button type="button" @click="exportToExcel" class="px-2 btn btn-outline-success"><i class="bi bi-file-earmark-excel-fill"></i></button>
            <button type="button" @click="unduhPdf" class="px-2 mx-2 btn btn-outline-danger"><i class="bi bi-file-earmark-pdf-fill"></i></button>
          </div>
        </div>
        <div class="modal-body" ref="contentToExport">
          <div class="text-center p-4">
            <h3 class="bold text-danger">Cetak Kartu</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js';

export default {
  data() {
    return {
      laporan_absensi: [],
    };
  },
  props: {
    dates: { type: Array, required: true },
    dataLaporanAbsensi: { type: Array, required: true },
    bulan: { type: String, required: true },
    tahun: { type: Number, required: true },
  },

  methods: {
    formatDate(date) {
      return new Date(date).getDate();
    },

    getStatus(item, date) {
      const attendance = item.absensi.find((a) => a.tanggal === date);
      if (attendance && attendance.hadir === true) {
        return '\u2714'; // Warna hijau muda jika hadir
      } else if (attendance && attendance.hadir === false) {
        return 'x';
      } else {
        return '';
      }
    },

    getBackgroundColor(item, date) {
      const attendance = item.absensi.find((a) => a.tanggal === date);
      if (attendance && attendance.hadir === true) {
        return '#90ff85';
      } else if (attendance && attendance.hadir === false) {
        return '#ff8787';
      } else {
        return '#bcbcbc';
      }
    },

    getdata() {
      if (this.dataLaporanAbsensi) {
        this.laporan_absensi = this.dataLaporanAbsensi;
      }
    },
    unduhPdf() {
      const contentToExport = this.$refs.contentToExport;
      const pdfOptions = {
        margin: 10,
        filename: 'exported-content.pdf',
        image: { type: 'pdf', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: [210, 330], orientation: 'landscape' },
      };
      html2pdf().from(contentToExport).set(pdfOptions).save();
    },

    exportToExcel() {
      // Mengumpulkan data dari tabel HTML
      const rows = document.querySelectorAll('.tabel-pdf tbody tr');

      // Membuat data dalam format yang diharapkan oleh XLSX
      const excelData = [['NO', 'NIK', 'Nama', 'Tanggal', 'Y', 'T']];

      rows.forEach((row) => {
        const rowData = [];
        row.querySelectorAll('td').forEach((cell) => {
          rowData.push(cell.textContent);
        });
        excelData.push(rowData);
      });

      // Membuat workbook baru
      const wb = XLSX.utils.book_new();

      // Membuat worksheet dari data
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Menambahkan worksheet ke workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Membuat blob dari workbook
      // Membuat buffer dari workbook
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Membuat blob dari buffer
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Membuat URL blob untuk membuat link download
      const url = window.URL.createObjectURL(blob);

      this.downloadLink(url);

      // Menghapus URL blob setelah download
      window.URL.revokeObjectURL(url);
    },

    downloadLink(url) {
      // Membuat elemen anchor untuk mendownload file
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.xlsx';
      document.body.appendChild(link); // Menambahkan elemen ke dalam dokumen

      // Fokuskan link dan lakukan klik
      link.focus();
      link.click();

      // Menghapus elemen dan URL blob setelah pengunduhan
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  },

  watch: {
    dataLaporanAbsensi: 'getdata',
    dates: 'getdata',
  },
};
</script>
