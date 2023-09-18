<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />
    <section class="section dashboard">
      <button type="button" @click="pulih_semua" class="btn btn-primary my-3 px-4">Pulih Semua</button>
      <div class="card">
        <div class="card-body py-4">
          <div :class="['scroll-container', defaultColorScrollbar, changeColorScrollbar]" @mousemove="handleMouseMove">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama</th>
                  <th>Nomor NIK</th>
                  <th class="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in karyawanSlice" :key="item.id">
                  <td class="align-middle">
                    {{ index + 1 }}
                  </td>
                  <td class="align-middle">
                    {{ item.karyawan.nama }}
                  </td>
                  <td class="align-middle">
                    {{ item.karyawan.no_nik }}
                  </td>
                  <td class="align-middle text-center">
                    <button @click="pulih(item.karyawan.id)" class="btn btn-primary mx-1">Pulih</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import PageTitle from './conponent/PageTitle.vue';
import router from '@/router';
import { API_KEY } from '../../env';

export default {
  inject: ['accessToken'],
  components: {
    PageTitle,
  },
  data() {
    return {
      defaultColorScrollbar: 'default-color-scroll',
      changeColorScrollbar: '',
      scrollTimer: null,
      index: 0,
      pageTitle: 'Pemulihan',
      dataKaryawan: [],
      currentPage: 1,
      itemsPerPage: 10,
      maxDisplayedPages: 3,
    };
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

    getAbsen() {
      axios
        .get(`${API_KEY}pemulihan`, {
          headers: {
            'x-access-token': this.accessToken,
          },
        })
        .then((response) => {
          this.dataKaryawan = response.data.data;
        })
        .catch((error) => {
          router.push({ name: 'Eror', params: { msg: error } });
        });
    },

    pulih(id) {
      // Lakukan permintaan POST menggunakan Axios
      axios
        .patch(`${API_KEY}pulih/${id}`)
        .then((response) => {
          alert(response.data.msg);
          this.getAbsen();
        })
        .catch((error) => {
          router.push({ name: 'Eror', params: { msg: error } });
        });
    },
    pulih_semua() {
      // Lakukan permintaan POST menggunakan Axios
      axios
        .patch(`${API_KEY}pulih`)
        .then((response) => {
          alert(response.data.msg);
          this.getAbsen();
        })
        .catch((error) => {
          router.push({ name: 'Eror', params: { msg: error } });
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
  },
  mounted() {
    // Set kelas awal menjadi 'default-color-scroll'
    this.changeColorScrollbar = this.defaultColorScrollbar;
    this.getAbsen();
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
  },
};
</script>
