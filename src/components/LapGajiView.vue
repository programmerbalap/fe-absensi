<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />
    <section class="section dashboard">
      <div class="card p-4">
        <div class="d-flex w-50 px-3 py-4">
          <select v-model="selectedYear" @change="updateData" class="form-select mx-2">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
          <select v-model="selectedMonth" @change="updateData" class="form-select mx-2">
            <option v-for="month in months" :key="month.value" :value="month.value">{{ month.name }}</option>
          </select>
        </div>
        <div class="card-body py-2">
          <div v-if="karyawanSlice.length > 0">
            <!-- End Modal Dialog Scrollable-->
            <div :class="['scroll-container', defaultColorScrollbar, changeColorScrollbar]" @mousemove="handleMouseMove">
              <!-- Small tables -->
              <table class="table table-sm table-bordered table-hover" style="font-size: 11px">
                <thead class="bg-light">
                  <tr class="my-4" style="background-color: #757bff">
                    <th scope="col" class="text-center align-middle" style="min-width: 50px">No.</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 200px">Nomor NIK</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 250px">Nama</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 150px">Jenis Kelamin</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 150px">Jabatan</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 150px">Durasi Normal (hh:mm:ss)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 150px">Durasi Lembur (hh:mm:ss)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 100px">Hadir (Hari)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 100px">Absen (Hari)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 100px">Bonus (Hari)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 100px">Normal (Hari)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 100px">Lembur (Hari)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 200px">Gaji Bonus (Rp.-)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 200px">Gaji Normal (Rp.-)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 200px">Gaji Lembur (Rp.-)</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 200px">Total Gaji (Rp.-)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in karyawanSlice" :key="item.id_karyawan">
                    <td class="align-middle text-center">
                      {{ index + 1 }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.no_nik }}
                    </td>
                    <td class="align-middle">
                      {{ item.nama }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.jenis_kelamin }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.jabatan.nama }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.TotalDurasiNormal ? item.TotalDurasiNormal.replace('-', '') : '00:00:00' }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.TotalDurasiLembur ? item.TotalDurasiLembur.replace('-', '') : '00:00:00' }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.Hadir }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.Tidak }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.Bonus }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.Normal }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.Lembur }}
                    </td>
                    <td class="align-middle text-center">{{ formatRupiah(item.GajiBonus) ? formatRupiah(item.GajiBonus) : 'Rp 0' }}</td>
                    <td class="align-middle text-center">{{ formatRupiah(item.GajiNormal) ? formatRupiah(item.GajiNormal) : 'Rp 0' }}</td>
                    <td class="align-middle text-center">{{ formatRupiah(item.GajiLembur) ? formatRupiah(item.GajiLembur) : 'Rp 0' }}</td>
                    <td class="align-middle text-center">
                      {{ formatRupiah(item.GajiNormal + item.GajiLembur + item.GajiBonus) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- End small tabitemles -->
            </div>
          </div>
          <div v-else>
            <page-not-found />
          </div>
        </div>

        <button type="button" class="btn btn-primary d-none" ref="modalButton" data-bs-toggle="modal" data-bs-target="#fullscreenModal">Full Screen Modal</button>
        <page-export-gaji :dataLaporanGaji="dataKaryawan" :bulan="selectedMonthName" :tahun="selectedYear" />

        <!-- Pagination with icons -->
        <nav aria-label="Page navigation example">
          <ul class="pagination mx-4">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" aria-label="Previous" @click="previousPage">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li class="page-item" v-for="page in displayedPageNumbers" :key="page" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" aria-label="Next" @click="nextPage">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
        <!-- End Pagination with icons -->
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import PageTitle from './conponent/PageTitle.vue';
import PageNotFound from './conponent/NotFound.vue';
// import router from '@/router';
import PageExportGaji from './exsport/export_gaji.vue';
import { API_KEY } from '../../env';

export default {
  components: {
    PageTitle,
    PageNotFound,
    PageExportGaji,
  },
  data() {
    return {
      defaultColorScrollbar: 'default-color-scroll',
      changeColorScrollbar: '',
      scrollTimer: null,
      index: 0,
      pageTitle: 'Laporan Gaji',
      id_kryn: '',
      document: {},
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      dates: [],
      years: [],
      months: [
        { value: 1, name: 'Januari' },
        { value: 2, name: 'Februari' },
        { value: 3, name: 'Maret' },
        { value: 4, name: 'April' },
        { value: 5, name: 'Mei' },
        { value: 6, name: 'Jui' },
        { value: 7, name: 'Juli' },
        { value: 8, name: 'Augustus' },
        { value: 9, name: 'September' },
        { value: 10, name: 'Oktober' },
        { value: 11, name: 'November' },
        { value: 12, name: 'Desember' },
      ],
      dataKaryawan: [],
      currentPage: 1, // halaman aktif saat ini
      itemsPerPage: 20, // jumlah karyawan per halaman
      maxDisplayedPages: 3, // jumlah maksimal nomor
      laporanGaji: [],
    };
  },

  props: {
    searchResults: {
      required: true,
    },
    exports_status: {
      required: true,
    },
  },

  methods: {
    handleMouseMove() {
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.changeColorScrollbar = 'change-color-scrollbar';
      this.scrollTimer = setTimeout(() => {
        this.changeColorScrollbar = [''];
      }, 2000);
    },

    getDataKaryawan() {
      const token = localStorage.getItem('accessToken');
      axios
        .get(`${API_KEY}laporan_gaji`, {
          headers: {
            'x-access-token': token,
          },
          params: {
            search_query: this.searchResults,
            year: this.selectedYear,
            month: this.selectedMonth,
          },
        })
        .then((response) => {
          this.dataKaryawan = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
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

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    goToPage(page) {
      this.currentPage = page;
    },

    async statusExp() {
      const btn = this.$refs.modalButton;
      if (this.exports_status === true) {
        btn.click();
        this.getDataKaryawan();
      }
    },
  },

  computed: {
    karyawanSlice() {
      // Menghitung indeks awal dan akhir untuk data karyawan yang akan ditampilkan di halaman saat ini
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      // Mengambil potongan data karyawan sesuai dengan halaman saat ini
      return this.dataKaryawan.slice(startIndex, endIndex);
    },
    totalPages() {
      // Menghitung total halaman berdasarkan jumlah data karyawan dan jumlah karyawan per halaman
      return Math.ceil(this.dataKaryawan.length / this.itemsPerPage);
    },
    displayedPageNumbers() {
      // Menghitung nomor-nomor halaman yang akan ditampilkan dalam navigasi
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;
      const maxDisplayedPages = this.maxDisplayedPages;

      if (totalPages <= maxDisplayedPages) {
        // Jika jumlah halaman keseluruhan lebih kecil dari atau sama dengan jumlah maksimal nomor halaman yang ditampilkan,
        // tampilkan semua nomor halaman dari 1 hingga totalPages.
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        // Jika jumlah halaman keseluruhan lebih besar dari jumlah maksimal nomor halaman yang ditampilkan,
        // tentukan nomor halaman awal dan akhir yang akan ditampilkan di tengah-tengah.
        const halfMaxDisplayedPages = Math.floor(maxDisplayedPages / 2);
        const firstDisplayedPage = Math.max(currentPage - halfMaxDisplayedPages, 1);
        const lastDisplayedPage = Math.min(firstDisplayedPage + maxDisplayedPages - 1, totalPages);

        // Jumlah halaman yang ditampilkan dapat lebih kecil dari jumlah maksimal jika halaman saat ini mendekati halaman akhir.
        return Array.from({ length: lastDisplayedPage - firstDisplayedPage + 1 }, (_, i) => firstDisplayedPage + i);
      }
    },

    selectedMonthName() {
      const selectedMonthObject = this.months.find((month) => month.value === this.selectedMonth);
      return selectedMonthObject ? selectedMonthObject.name : 'Not Found';
    },
  },

  mounted() {
    // Set kelas awal menjadi 'default-color-scroll'
    this.changeColorScrollbar = this.defaultColorScrollbar;
    this.getDataKaryawan();

    // Mengisi daftar tanggal dalam satu bulan (Februari 2023)
    const startDate = new Date(2023, 7, 1); // Bulan dimulai dari 0 (Januari), sehingga 1 adalah Februari
    const endDate = new Date(2023, 8, 0);
    const daysInMonth = (endDate - startDate) / (1000 * 60 * 60 * 24);

    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i + 1);
      this.dates.push(date.toISOString().slice(0, 10)); // Format tanggal ke bentuk YYYY-MM-DD
    }
    // Generate an array of years to display in the select dropdown (from current year until 10 years ago)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 10; i--) {
      this.years.push(i);
    }
  },

  watch: {
    selectedYear: 'getDataKaryawan', // Call getDataKaryawan() when selectedYear changes
    selectedMonth: 'getDataKaryawan', // Call getDataKaryawan() when selectedMonth changes
    searchResults: 'getDataKaryawan',
    exports_status: 'statusExp',
  },
};
</script>
