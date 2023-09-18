<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />
    <section class="section dashboard">
      <div class="card">
        <div class="card-body">
          <button type="button" class="btn btn-primary m-4" data-bs-toggle="modal" data-bs-target="#modalDialogScrollable">+ Tambah</button>
          <!-- <page-tambah-karyawan-vue @get-data-karyawan="getDataKaryawan" /> -->
          <!-- End Modal Dialog Scrollable-->
          <div :class="['scroll-container', defaultColorScrollbar, changeColorScrollbar]" @mousemove="handleMouseMove">
            <table class="table table-sm table-hover">
              <thead class="bg-light">
                <tr class="my-4">
                  <th scope="col" class="text-center" style="min-width: 30px">No.</th>
                  <th scope="col" class="text-center" style="min-width: 200px">Nama</th>
                  <th scope="col" class="text-center" style="min-width: 100px">Tanggal</th>
                  <th scope="col" class="text-center" style="min-width: 100px">Hadir</th>
                  <th scope="col" class="text-center" style="min-width: 100px">Start</th>
                  <th scope="col" class="text-center" style="min-width: 100px">End</th>
                  <th scope="col" class="text-center" style="min-width: 100px">Shift</th>
                </tr>
              </thead>
              <tbody v-if="absensiSlice.length > 0">
                <tr v-for="(item, index) in absensiSlice" :key="item.id">
                  <td class="align-middle text-center">
                    {{ index + 1 }}
                  </td>
                  <td class="align-middle">
                    {{ item.karyawan.nama }}
                  </td>
                  <td class="align-middle text-center">
                    {{ item.tanggal }}
                  </td>
                  <td class="align-middle text-center">
                    {{ item.hadir ? 'Ya' : 'Tidak' }}
                  </td>
                  <td class="align-middle text-center">
                    {{ item.hadir ? item.time_start : '-' }}
                  </td>
                  <td class="align-middle text-center">
                    {{ item.hadir ? item.time_end : '-' }}
                  </td>
                  <td class="align-middle text-center">
                    {{ item.hadir ? item.shift.nama : '-' }}
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr class="text-center">
                  <td colspan="8" class="py-4 my-4 text-secondary">
                    <h1>404</h1>
                    <h2>The page you are looking for doesn't exist.</h2>
                    <div class="credits">Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a></div>
                  </td>
                </tr>
                <section class="section error-404 d-flex flex-column align-items-center justify-content-center"></section>
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
// import router from '@/router';
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
      pageTitle: 'Detail Absensi',
      id_kryn: '',
      dataAbsensi: [],
      currentPage: 1,
      itemsPerPage: 20,
      maxDisplayedPages: 3,
    };
  },

  props: {
    searchResults: {
      required: true,
    },
  },

  watch: {
    searchResults: 'getDataAbsensi',
  },

  methods: {
    getDataAbsensi() {
      const token = localStorage.getItem('accessToken');
      axios
        .get(`${API_KEY}absensi`, {
          headers: {
            'x-access-token': token,
          },
          params: {
            search_query: this.searchResults,
          },
        })
        .then((response) => {
          this.dataAbsensi = response.data.data;
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
  },

  computed: {
    absensiSlice() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.dataAbsensi.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.dataAbsensi.length / this.itemsPerPage);
    },
    displayedPageNumbers() {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;
      const maxDisplayedPages = this.maxDisplayedPages;

      if (totalPages <= maxDisplayedPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        const halfMaxDisplayedPages = Math.floor(maxDisplayedPages / 2);
        const firstDisplayedPage = Math.max(currentPage - halfMaxDisplayedPages, 1);
        const lastDisplayedPage = Math.min(firstDisplayedPage + maxDisplayedPages - 1, totalPages);
        return Array.from({ length: lastDisplayedPage - firstDisplayedPage + 1 }, (_, i) => firstDisplayedPage + i);
      }
    },
  },

  mounted() {
    this.changeColorScrollbar = this.defaultColorScrollbar;
    this.getDataAbsensi();
  },
};
</script>
