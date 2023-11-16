<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />
    <section class="section dashboard">
      <div class="d-flex justify-content-between align-items-center">
        <button type="button" @click="akhiri" class="btn btn-primary my-3 px-4">Akhiri</button>
        <div>
          <button :class="['btn', 'mx-1', 'btn-outline-warning']" type="button">Time: {{ currentTime }}</button>
          <button :class="['btn', 'mx-1', isShiftHidden ? 'btn-primary' : 'btn-outline-primary']" for="flexSwitchCheckChecked">{{ isShiftHidden ? 'Jam Normal' : 'Jam Lembur' }}</button>
        </div>
      </div>
      <div class="card">
        <div class="card-body py-3">
          <div :class="['scroll-container', defaultColorScrollbar, changeColorScrollbar]" @mousemove="handleMouseMove">
            <div class="row p-4">
              <div class="col-md-6 m-0" v-for="item in dataStayAbsensi" :key="item.id">
                <div class="card">
                  <div class="card-body p-3">
                    <!-- <p>{{ index + 1 }}</p> -->
                    <div class="d-flex">
                      <div class="overflow-hidden" style="height: 140px; width: 120px">
                        <img style="width: 100px" :src="item.dokumen === null ? 'foto_masibelum_ada' : getUrl(item.dokumen.foto)" :alt="item.dokumen ? 'Foto' : 'Foto Tidak Tersedia'" />
                      </div>
                      <div class="px-3 justify-content-between" style="width: 100%">
                        <div>
                          <h4 class="card-title my-0 py-2">{{ item.nama }}</h4>
                          <h6 class="">{{ item.no_nik }}</h6>
                          <h6 class="">{{ item.jenis_kelamin }}</h6>
                        </div>
                        <div class="d-flex justify-content-between align-items-center" v-if="item.absensi.length !== 0">
                          <div>
                            <p class="py-0 my-0 text-danger" style="font-size: 14px">Jam Mulai : {{ item.jam_mulai }}</p>
                            <p class="py-0 mt-0 my-2 text-primary" style="font-size: 14px">Durasi : {{ item.durasi ? item.durasi : '00:00:00' }}</p>
                          </div>
                          <div>
                            <button
                              :disabled="item.absensi.length > 0 && item.absensi[0].time_end === null"
                              @click="start(item.id, true)"
                              type="button"
                              :class="['btn', item.absensi.length > 0 && item.absensi[0].time_end === null ? 'btn-secondary' : 'btn-success', 'btn-sm', 'my-3', 'mx-1', 'px-2']"
                            >
                              <i class="bi bi-skip-start-circle"></i> Start
                            </button>
                            <button
                              :disabled="item.absensi.length === 0 || item.absensi[0].time_end !== null"
                              @click="stop(item.id)"
                              type="button"
                              :class="['btn', item.absensi.length === 0 || item.absensi[0].time_end !== null ? 'btn-secondary' : 'btn-danger', 'btn-sm', 'my-3', 'mx-1', 'px-2']"
                            >
                              <i class="bi bi-stop-circle"></i> Stop
                            </button>
                          </div>
                        </div>
                        <div v-else><h2 class="text-end text-danger">Tidak Masuk</h2></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import PageTitle from './conponent/PageTitle.vue';
// import router from '@/router';
import SweetAlertHelper from '@/SweetAlertHelper/SweetAlertHelper';
import { API_KEY } from '../../env';
import router from '@/router';

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
      dataStayAbsensi: [],
      index: 0,
      pageTitle: 'Absensi Aktif',
      msg: '',
      durasiJamKerja: '',
      timer: '',
      intervalIds: {},
      isShiftHidden: false,
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

    stayAbsensi() {
      const token = localStorage.getItem('accessToken');
      axios
        .get(`${API_KEY}ready_present/${true}`, {
          params: {
            shift: this.getShiftStatus(),
          },
          headers: {
            'x-access-token': token,
          },
        })
        .then((response) => {
          this.dataStayAbsensi = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    getUrl(item) {
      return `${API_KEY}${item}`;
    },

    start(id, status) {
      const data = {
        id_karyawan: id,
        hadir: status,
        shift: this.getShiftStatus(),
      };
      axios
        .post(`${API_KEY}start_presensi`, data)
        .then((response) => {
          this.msg = response.data.msg;
          alert(this.msg);
          this.stayAbsensi();
        })
        .catch((error) => {
          router.push({ name: 'Eror', params: { msg: error } });
          // console.log(error.response);
        });
    },

    stop(id) {
      axios
        .patch(`${API_KEY}end_presensi/${id}`)
        .then((response) => {
          SweetAlertHelper.success('Berhasil!', response.data.msg);
          this.stayAbsensi();
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    akhiri() {
      SweetAlertHelper.confirm('Apakah yakin mengakhiri?', 'Jika sudah yakin klik oke!').then((result) => {
        if (result.isConfirmed) {
          axios
            .patch(`${API_KEY}selesai`)
            .then((response) => {
              if (response.status === 200) {
                SweetAlertHelper.success('Berhasil!', response.data.msg);
              }
              this.stayAbsensi();
            })
            .catch((error) => {
              if (error.response && error.response.status === 409) {
                SweetAlertHelper.error('Gagal!', error.response.data.msg);
              } else if (error.response && error.response.status === 400) {
                // router.push({ name: 'Eror', params: { msg: error } });
                console.log(error.response);
              }
            });
        }
      });
    },

    getShiftStatus() {
      let sts = localStorage.getItem('shift');
      return sts === 'true';
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

  mounted() {
    this.isShiftHidden = this.getShiftStatus();
    this.changeColorScrollbar = this.defaultColorScrollbar;
    this.stayAbsensi();
    setInterval(this.updateTime, 1000);
  },
};
</script>
