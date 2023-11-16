<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />
    <section class="section dashboard">
      <div class="card">
        <div class="card-body">
          <button type="button" class="btn btn-primary m-4" data-bs-toggle="modal" data-bs-target="#modal-tambah-karyawan">+ Tambah</button>
          <page-tambah-karyawan-vue @get-data-karyawan="getDataKaryawan" />
          <div v-if="karyawanSlice.length > 0">
            <div :class="['scroll-container', defaultColorScrollbar, changeColorScrollbar]" @mousemove="handleMouseMove">
              <table class="table table-sm table-hover" style="font-size: 11px">
                <thead class="bg-light">
                  <tr class="my-4">
                    <th scope="col" class="text-center" style="min-width: 30px">No.</th>
                    <th scope="col" class="text-center" style="min-width: 30px">Profile</th>
                    <th scope="col" class="text-center" style="min-width: 300px">Nomor NIK</th>
                    <th scope="col" class="text-center" style="min-width: 250px">Nama</th>
                    <th scope="col" class="text-center" style="min-width: 120px">Jenis Kelamin</th>
                    <th scope="col" class="text-center" style="min-width: 120px">Jabatan</th>
                    <th scope="col" class="text-center" style="min-width: 220px">Tempat & Tanggal Lahir</th>
                    <th scope="col" class="text-center" style="min-width: 200px">Alamat Kota</th>
                    <th scope="col" class="text-center" style="min-width: 200px">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in karyawanSlice" :key="item.karyawan.id">
                    <td class="align-middle">
                      {{ index + 1 }}
                    </td>
                    <td class="align-middle overflow-hidden"><img style="height: 30px; width: 2 5px" :src="getUrl(item.foto)" alt="foto" /></td>
                    <td class="align-middle text-center">
                      <!-- {{ convertFormatText(item.karyawan.no_nik) }} -->
                      {{ Number.parseFloat(item.karyawan.no_nik).toFixed(0) }}
                    </td>
                    <td class="align-middle">
                      {{ item.karyawan.nama }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.karyawan.jenis_kelamin }}
                    </td>
                    <td class="align-middle text-center">
                      {{ item.karyawan.jabatan.nama }}
                    </td>
                    <td class="align-middle">
                      {{ item.karyawan.tmp_lhr }},
                      {{ item.karyawan.tgl_lhr }}
                    </td>
                    <td class="align-middle">
                      {{ item.karyawan.kota.nama }}
                    </td>
                    <td class="align-middle text-center">
                      <button @click="getDocById(item.karyawan.id)" class="btn btn-primary btn-sm mx-1" data-bs-toggle="modal" data-bs-target="#modal-upload-file">
                        <i class="bi bi-file-earmark-arrow-up"></i>
                      </button>
                      <page-upload-file :dataDoc="documentById" @get-data-karyawan="getDataKaryawan" />
                      <button @click="hapus(item.karyawan.id)" class="btn btn-danger btn-sm">
                        <i class="bi bi-trash"></i>
                      </button>
                      <button @click="getKarById(item.karyawan.id)" class="btn btn-success btn-sm mx-1" data-bs-toggle="modal" data-bs-target="#modal-ubah-karyawan">
                        <i class="bi bi-recycle"></i>
                      </button>
                      <page-ubah-karyawan-vue :dataKar="karyawanById" @get-data-karyawan="getDataKaryawan" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else>
            <page-not-found />
          </div>
        </div>

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
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import PageTitle from './conponent/PageTitle.vue';
import PageTambahKaryawanVue from './conponent/PageTambahKaryawan.vue';
import PageUbahKaryawanVue from './conponent/PageUbahKaryawan.vue';
import PageUploadFile from './conponent/PageUploadFile.vue';
import PageNotFound from './conponent/NotFound.vue';
// import router from '@/router';
import SweetAlertHelper from '../SweetAlertHelper/SweetAlertHelper';
import { API_KEY } from '../../env';

export default {
  components: {
    PageTitle,
    PageTambahKaryawanVue,
    PageUbahKaryawanVue,
    PageUploadFile,
    PageNotFound,
  },

  data() {
    return {
      defaultColorScrollbar: 'default-color-scroll',
      changeColorScrollbar: '',
      scrollTimer: null,
      index: 0,
      pageTitle: 'Karyawan',
      dataKaryawan: [],
      currentPage: 1, // halaman aktif saat ini
      itemsPerPage: 20, // jumlah karyawan per halaman
      maxDisplayedPages: 10, // jumlah maksimal nomor
      documentById: {},
      karyawanById: {},
    };
  },

  props: {
    searchResults: {
      required: true,
    },
  },

  watch: {
    searchResults: 'getDataKaryawan',
  },

  methods: {
    async getDataKaryawan() {
      const token = localStorage.getItem('accessToken');
      await axios
        .get(`${API_KEY}karyawan`, {
          headers: {
            'x-access-token': token,
          },
          params: {
            search_query: this.searchResults,
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

    getUrl(item) {
      return `${API_KEY}${item}`;
    },

    async getDocById(id) {
      await axios
        .get(`${API_KEY}document/${id}`)
        .then((response) => {
          this.documentById = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    async getKarById(id) {
      await axios
        .get(`${API_KEY}karyawan/${id}`)
        .then((response) => {
          this.karyawanById = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    hapus(id) {
      SweetAlertHelper.confirm('Apakah yakin?', 'Data akan dihapus secara permanen.').then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${API_KEY}karyawan/${id}`)
            .then((response) => {
              if (response.status === 204) {
                SweetAlertHelper.success('Berhasil!', 'Data telah dihapus.');
                this.getDataKaryawan();
              }
            })
            .catch((error) => {
              // router.push({ name: 'Eror', params: { msg: error } });
              console.log(error.response);
            });
        }
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

    convertFormatText(number) {
      return Number.parseFloat(number).toFixed(0);
    },
  },

  mounted() {
    // Set kelas awal menjadi 'default-color-scroll'
    this.changeColorScrollbar = this.defaultColorScrollbar;
    this.getDataKaryawan();
  },
};
</script>
