<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />
    <section class="section dashboard">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-start d-flex flex-column mb-1 pb-1">
          <button :class="['btn', 'mx-1', 'my-2', isShiftDisabled ? 'btn-warning' : 'btn-outline-warning']" type="button">Time : {{ currentTime }}</button>
          <button :class="['btn', 'mx-1', 'my-2', isShiftDisabled ? 'btn-warning' : 'btn-outline-warning']" type="button">Start : {{ jamEfektif.start }}</button>
        </div>

        <div class="text-end align-items-center">
          <div class="d-flex align-items-center my-0 justify-content-between">
            <div class="form-check form-switch mx-2 ps-1">
              <input @click="setStatusShift()" class="form-check-input mx-1" type="checkbox" :hidden="hiddenAktif.length === 0 ? false : true" :checked="isShiftDisabled" />
            </div>
            <button :class="['btn', 'px-3', isShiftDisabled ? 'btn-primary' : 'btn-outline-primary']" for="flexSwitchCheckChecked">{{ isShiftDisabled ? 'Jam Normal' : 'Jam Lembur' }}</button>
          </div>
          <div class="d-flex align-items-center justify-content-between my-0">
            <div class="form-check form-switch mx-2 ps-1">
              <input @click="toggleBonusAll" class="form-check-input mx-1" type="checkbox" :hidden="isShiftDisabled ? false : true" />
            </div>
            <button type="button" @click="startAll(bonusAll, isShiftDisabled)" :class="['btn', 'my-3', isShiftDisabled ? 'btn-primary' : 'btn-outline-primary']">Hadir Semua</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body py-4">
          <div :class="['scroll-container', defaultColorScrollbar, changeColorScrollbar]" @mousemove="handleMouseMove">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Profile</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th class="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in karyawanSlice" :key="item.karyawan.id">
                  <td class="align-middle">
                    {{ index + 1 }}
                  </td>
                  <td class="align-middle overflow-hidden"><img style="height: 35px; width: 28px" :src="getUrl(item.foto)" alt="foto" /></td>
                  <td class="align-middle">
                    {{ item.karyawan.nama }}
                  </td>
                  <td class="align-middle">{{ item.karyawan.jabatan.nama }}</td>
                  <td class="align-middle text-center d-flex justify-content-center align-items-center">
                    <div class="form-check form-switch" :hidden="isShiftDisabled ? false : true">
                      <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="item.karyawan.on" @change="toggleBonus(item.karyawan.id)" />
                    </div>
                    <button @click="start(item.karyawan.id, true, item.karyawan.on ? true : false, isShiftDisabled)" class="btn btn-sm btn-primary my-1 mx-1">Hadir</button>
                    <button @click="start(item.karyawan.id, false, item.karyawan.on ? true : false, isShiftDisabled)" class="btn btn-sm btn-danger mx-1 px-3">Izin</button>
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
import SweetAlertHelper from '@/SweetAlertHelper/SweetAlertHelper';

export default {
  components: {
    PageTitle,
  },
  data() {
    return {
      defaultColorScrollbar: 'default-color-scroll',
      changeColorScrollbar: '',
      scrollTimer: null,
      index: 0,
      pageTitle: 'Absensi',
      dataKaryawan: [],
      currentPage: 1,
      itemsPerPage: 10,
      maxDisplayedPages: 3,
      isShiftDisabled: false,
      jamEfektif: {},
      bonusAll: false,
      hiddenAktif: [],
      currentTime: '',
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

    getJamEfektif() {
      axios
        .get(`https://tired-erin-pantsuit.cyclic.cloud/jam_kerja/1`)
        .then((response) => {
          this.jamEfektif = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    getAbsen() {
      const token = localStorage.getItem('accessToken');
      axios
        .get(`https://tired-erin-pantsuit.cyclic.cloud/prepare_present`, {
          headers: {
            'x-access-token': token,
          },
        })
        .then((response) => {
          this.dataKaryawan = response.data.data;
          this.getHiddenAktif();
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    getUrl(item) {
      return `https://tired-erin-pantsuit.cyclic.cloud/${item}`;
    },

    getHiddenAktif() {
      axios
        .get(`https://tired-erin-pantsuit.cyclic.cloud/aktif`)
        .then((response) => {
          this.hiddenAktif = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    startAll(bonus, shift) {
      if (this.dataKaryawan.length == 0) {
        SweetAlertHelper.error('Gagal!', 'Tidak ada data yang ditambahkan!');
      } else {
        SweetAlertHelper.confirm('Yakin mulai semua?', 'Silahkan klik YES jika yakin!').then((result) => {
          if (result.isConfirmed) {
            axios
              .post(`https://tired-erin-pantsuit.cyclic.cloud/start_all_presensi`, {
                bonusAll: bonus,
                shift: shift,
              })
              .then((response) => {
                SweetAlertHelper.success('Berhasil!', response.data.msg);
                this.getAbsen();
              })
              .catch((error) => {
                // router.push({ name: 'Eror', params: { msg: error } });
                console.log(error.response);
              });
          }
        });
      }
    },

    start(id, hadir, bonus, shift) {
      const data = {
        id_karyawan: id,
        hadir: hadir,
        bonus: bonus,
        shift: shift,
      };

      axios
        .post(`https://tired-erin-pantsuit.cyclic.cloud/start_presensi`, data)
        .then((response) => {
          SweetAlertHelper.success('Berhasil!', response.data.msg);
          this.getAbsen();
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    toggleBonus(karyawanId) {
      const item = this.karyawanSlice.find((item) => item.karyawan.id === karyawanId);
      if (item) {
        item.karyawan.on === !item.karyawan.on;
      }
    },

    toggleBonusAll() {
      this.bonusAll = !this.bonusAll;
    },

    setStatusShift() {
      const sts = this.getStatusShift();
      localStorage.setItem('shift', !sts);
      this.isShiftDisabled = this.getStatusShift();
    },

    getStatusShift() {
      const shift = localStorage.getItem('shift');
      return shift === 'true';
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

    updateTime() {
      const options = {
        timeZone: 'Asia/Jakarta',
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      this.currentTime = new Date().toLocaleTimeString('id-ID', options);
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
  },

  mounted() {
    // Set kelas awal menjadi 'default-color-scroll'
    this.changeColorScrollbar = this.defaultColorScrollbar;
    this.getAbsen();
    this.isShiftDisabled = this.getStatusShift();
    this.getJamEfektif();
    this.getHiddenAktif();
    setInterval(this.updateTime, 1000);
  },
};
</script>
