<template>
  <div class="modal fade" id="fullscreenModal" tabindex="-1">
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
            <h3 class="bold text-danger">Laporan Gaji Karyawan STG</h3>
            <h6 class="fst-italic">Bulan {{ bulan }} , Tahun {{ tahun }}</h6>
          </div>
          <table class="table table-sm tabel-pdf" style="font-size: 11px">
            <thead class="bg-light">
              <tr class="my-4 border-top border-bottom border-top border-secondary" style="background-color: #ffdada">
                <th scope="col" class="text-center align-middle py-2 border-secondary border-start border-end">No.</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Nomor NIK</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Nama</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Jabatan</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Durasi Normal</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Durasi Lembur</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Bonus</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Normal</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Lembur</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Gaji Bonus</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Gaji Normal</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Gaji Lembur</th>
                <th scope="col" class="text-center align-middle py-2 border-secondary border-end">Total</th>
              </tr>
            </thead>
            <tbody style="font-size: 11px">
              <tr class="border-bottom border-secondary" v-for="(item, index) in laporan_gaji" :key="item.id_karyawan">
                <td class="align-middle text-center border-start border-end border-secondary">
                  {{ index + 1 }}
                </td>
                <td class="align-middle text-center border-end border-secondary">
                  {{ item.no_nik }}
                </td>
                <td class="align-middle border-end border-secondary">
                  {{ item.nama }}
                </td>
                <td class="align-middle text-center border-end border-secondary">
                  {{ item.jabatan.nama }}
                </td>
                <td class="align-middle text-center border-end border-secondary">
                  {{ item.TotalDurasiNormal ? item.TotalDurasiNormal.replace('-', '') : '00:00:00' }}
                </td>
                <td class="align-middle text-center border-end border-secondary">
                  {{ item.TotalDurasiLembur ? item.TotalDurasiLembur.replace('-', '') : '00:00:00' }}
                </td>
                <td class="align-middle text-center border-end border-secondary">
                  {{ item.Bonus }}
                </td>
                <td class="align-middle text-center border-end border-secondary">
                  {{ item.Normal }}
                </td>
                <td class="align-middle text-center border-end border-secondary">
                  {{ item.Lembur }}
                </td>
                <td class="align-middle text-center border-end border-secondary">{{ formatRupiah(item.GajiBonus) ? formatRupiah(item.GajiBonus) : 'Rp 0' }}</td>
                <td class="align-middle text-center border-end border-secondary">{{ formatRupiah(item.GajiNormal) ? formatRupiah(item.GajiNormal) : 'Rp 0' }}</td>
                <td class="align-middle text-center border-end border-secondary">{{ formatRupiah(item.GajiLembur) ? formatRupiah(item.GajiLembur) : 'Rp 0' }}</td>
                <td class="align-middle text-center border-end border-secondary">
                  {{ formatRupiah(item.GajiNormal + item.GajiLembur + item.GajiBonus) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tabel-pdf .table {
  line-height: 1;
  border-width: 0px; /* Atur line spacing sesuai kebutuhan Anda */
}
h6.fst-italic {
  margin-top: -5px;
}
</style>

<script>
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      laporan_gaji: [],
    };
  },
  props: {
    dataLaporanGaji: { type: Array, required: true },
    bulan: { type: String, required: true },
    tahun: { type: Number, required: true },
  },

  methods: {
    getdata() {
      if (this.dataLaporanGaji) {
        this.laporan_gaji = this.dataLaporanGaji;
      }
    },

    formatRupiah(value) {
      if (typeof value !== 'number') {
        return value;
      }
      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Ubah nilai ini menjadi 0
        maximumFractionDigits: 0, // Ubah nilai ini menjadi 0
      });
      return formatter.format(value).replace('-', '');
    },

    unduhPdf() {
      const contentToExport = this.$refs.contentToExport; // Ref to the content div
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
      const rows = document.querySelectorAll('.tabel-pdf tr');

      // Membuat data dalam format yang diharapkan oleh XLSX
      const excelData = [['NO', 'NIK', 'Nama', 'Jabatan', 'Bonus', 'Normal', 'Lembur', 'Gaji Normal', 'Gaji Lembur', 'Durasi Lembur', 'Durasi Normal', 'Total']];

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
    dataLaporanGaji: 'getdata',
  },
};
</script>
