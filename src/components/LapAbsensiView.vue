<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />
    <section class="section dashboard">
      <div class="card" id="contentToExport" ref="contentToExport">
        <div class="d-flex w-50 px-3 py-4">
          <select v-model="selectedYear" @change="updateDates" class="form-select mx-2">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
          <select v-model="selectedMonth" @change="updateDates" class="form-select mx-2">
            <option v-for="month in months" :key="month.value" :value="month.value">{{ month.name }}</option>
          </select>
        </div>
        <div class="card-body">
          <div v-if="karyawanSlice.length > 0">
            <!-- End Modal Dialog Scrollable-->
            <div :class="['scroll-container', defaultColorScrollbar, changeColorScrollbar]" @mousemove="handleMouseMove">
              <!-- Small tables -->
              <table class="table table-sm table-bordered border-secondary table-hover" style="font-size: 11px">
                <thead>
                  <tr class="my-4" style="background-color: #757bff">
                    <th scope="col" class="text-center align-middle" style="min-width: 50px" rowspan="2">NO</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 200px" rowspan="2">Nama</th>
                    <th scope="col" class="text-center align-middle" style="min-width: 100px" rowspan="2">Jabatan</th>
                    <th scope="col" class="text-center align-middle" :colspan="dates.length">Tanggal</th>
                    <th scope="col" class="text-center align-middle" colspan="2" style="background-color: #ffd760">Jumlah</th>
                  </tr>
                  <tr class="my-4" style="background-color: #d2d2d2">
                    <th class="text-center align-middle border-secondary border-end" v-for="date in dates" :key="date">{{ formatDate(date) }}</th>
                    <th class="border-secondary border-end text-center align-middle" style="background-color: #ffd760">Y</th>
                    <th class="border-secondary border-end text-center align-middle" style="background-color: #ffd760">T</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in karyawanSlice" :key="item.id">
                    <td class="align-middle text-center">
                      {{ index + 1 }}
                    </td>
                    <td class="align-middle">
                      {{ item.nama }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.jabatan.nama }}
                    </td>
                    <td class="align-middle text-center" v-for="date in dates" :key="date" :style="{ 'background-color': getBackgroundColor(item, date) }">
                      {{ getStatus(item, date) }}
                    </td>
                    <td class="align-middle text-center" style="background-color: #ffd760">
                      {{ item.Hadir }}
                    </td>
                    <td class="align-middle text-center" style="background-color: #ffd760">
                      {{ item.Tidak }}
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

        <button type="button" class="btn btn-primary d-none" ref="modalButton" data-bs-toggle="modal" data-bs-target="#modal-laporan-absensi">Full Screen Modal</button>

        <export-absensi-vue :bulan="selectedMonthName" :tahun="selectedYear" :dataLaporanAbsensi="dataKaryawan" :dates="dates" />

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
import exportAbsensiVue from './exsport/export_absensi.vue';
import { API_KEY } from '../../env';

export default {
  components: {
    PageTitle,
    PageNotFound,
    exportAbsensiVue,
  },
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      defaultColorScrollbar: 'default-color-scroll',
      changeColorScrollbar: '',
      scrollTimer: null,
      index: 0,
      pageTitle: 'Laporan Absensi',
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

    async getDataKaryawan() {
      const token = localStorage.getItem('accessToken');
      axios
        .get(`${API_KEY}laporan_absensi`, {
          headers: {
            'x-access-token': token,
          },
          params: {
            search_query: this.searchResults ? this.searchResults : '',
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

    handleMouseMove() {
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.changeColorScrollbar = 'change-color-scrollbar';
      this.scrollTimer = setTimeout(() => {
        this.changeColorScrollbar = [''];
      }, 2000);
    },

    async statusExp() {
      const btn = this.$refs.modalButton;
      if (this.exports_status === true) {
        btn.click();
        this.getDataKaryawan();
      }
    },

    updateDates() {
      this.dates = []; // Mengosongkan array this.dates sebelum menambahkan tanggal-tanggal baru

      const startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
      const endDate = new Date(this.selectedYear, this.selectedMonth, 0);
      const daysInMonth = (endDate - startDate) / (1000 * 60 * 60 * 24);

      for (let i = 0; i <= daysInMonth; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i + 1);
        this.dates.push(date.toISOString().slice(0, 10)); // Format tanggal ke bentuk YYYY-MM-DD
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

    // Generate an array of years to display in the select dropdown (from current year until 10 years ago)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 10; i--) {
      this.years.push(i);
    }

    this.updateDates();
    this.getDataKaryawan();
  },

  watch: {
    searchResults: 'getDataKaryawan',
    selectedYear: 'getDataKaryawan', // Call getDataKaryawan() when selectedYear changes
    selectedMonth: 'getDataKaryawan', // Call getDataKaryawan() when selectedMonth changes
    exports_status: 'statusExp',
  },
};
</script>
