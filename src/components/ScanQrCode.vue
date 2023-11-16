<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />
    <section class="section dashboard">
      <div class="text-center">
        <div class="py-2 mt-4">
          <h2 class="text-primary fw-semibold">Scan di Sini</h2>
        </div>
        <p>{{ error }}</p>
        <div class="card p-2 mx-auto" style="position: relative; max-height: 500px; max-width: 500px; overflow: hidden; border-radius: 15px">
          <div style="position: relative; height: 100%; width: 100%; overflow: hidden; border-radius: 10px">
            <qrcode-stream style="width: 100%; height: 100%" @decode="onDecode" @init="onInit" class="camera-video"></qrcode-stream>
            <div class="scanner"></div>
          </div>
          <div class="border-top-left"></div>
          <div class="border-top-right"></div>
          <div class="border-bottom-left"></div>
          <div class="border-bottom-right"></div>
        </div>
        <div class="text-primary">
          <p style="font-size: 14px" class="fst-italic">Perlihatkan kartu QR Code anda di depan camera sampai</p>
          <p style="font-size: 14px; margin-top: -15px" class="fst-italic">pemindaian berhasil!</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
.border-top-left,
.border-top-right,
.border-bottom-left,
.border-bottom-right {
  position: absolute;
  width: 30px; /* Sesuaikan dengan lebar border yang Anda inginkan */
  height: 30px; /* Sesuaikan dengan tinggi border yang Anda inginkan */
  background-color: transparent; /* Ganti dengan warna border yang Anda inginkan */
}

.border-top-left {
  top: 0;
  left: 0;
  border-top-left-radius: 10px;
  border-top: 10px solid #245ff6; /* Ganti dengan warna border yang Anda inginkan */
  border-left: 10px solid #245ff6; /* Ganti dengan warna border yang Anda inginkan */
}

.border-top-right {
  top: 0;
  right: 0;
  border-top-right-radius: 10px;
  border-top: 10px solid #245ff6; /* Ganti dengan warna border yang Anda inginkan */
  border-right: 10px solid #245ff6; /* Ganti dengan warna border yang Anda inginkan */
}

.border-bottom-left {
  bottom: 0;
  left: 0;
  border-bottom-left-radius: 10px;
  border-bottom: 10px solid #245ff6; /* Ganti dengan warna border yang Anda inginkan */
  border-left: 10px solid #245ff6; /* Ganti dengan warna border yang Anda inginkan */
}

.border-bottom-right {
  bottom: 0;
  right: 0;
  border-bottom-right-radius: 10px;
  border-bottom: 10px solid #245ff6; /* Ganti dengan warna border yang Anda inginkan */
  border-right: 10px solid #245ff6; /* Ganti dengan warna border yang Anda inginkan */
}

/* Di dalam file CSS Anda */
.scanner {
  z-index: 1;
  top: 0%;
  position: absolute;
  width: 100%; /* Sesuaikan lebar elemen dengan preferensi Anda */
  height: 100%; /* Sesuaikan tinggi elemen dengan preferensi Anda */
  background-color: transparent;
  border-top: 10px solid rgba(255, 255, 255, 0.7); /* Atur latar belakang elemen sesuai kebutuhan */
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translatey(100%);
  }
}
</style>

<script>
import PageTitle from './conponent/PageTitle.vue';
import { QrcodeStream } from 'vue3-qrcode-reader';
import axios from 'axios';
import { API_KEY } from '../../env';
import SweetAlertHelper from '@/SweetAlertHelper/SweetAlertHelper';

export default {
  components: {
    PageTitle,
    QrcodeStream,
  },
  data() {
    return {
      pageTitle: 'Scan QR Code',
      error: '',
    };
  },
  methods: {
    async onInit(promise) {
      // show loading indicator
      try {
        const { capabilities } = await promise;
        console.log(capabilities);
        this.error = '';
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          this.error = 'User denied camera access permission.';
          console.log('User denied camera access permission.');
        } else if (err.name === 'NotFoundError') {
          this.error = 'No suitable camera device installed.';
          console.log('No suitable camera device installed.');
        } else if (err.name === 'NotSupportedError') {
          this.error = 'Page is not served over HTTPS (or localhost).';
          console.log('Page is not served over HTTPS (or localhost).');
        } else if (err.name === 'NotReadableError') {
          this.error = 'Maybe camera is already in use.';
          console.log('Maybe camera is already in use.');
        } else if (err.name === 'OverconstrainedError') {
          this.error = 'Did you request the front camera although there is none?';
          console.log('Did you request the front camera although there is none?');
        } else if (err.name === 'StreamApiNotSupportedError') {
          this.error = 'Browser seems to be lacking features.';
          console.log('Browser seems to be lacking features.');
        }
      }
    },

    onDecode(decodedString) {
      console.log(decodedString);
      this.start(1, true, true, true);
    },

    cekAktifAbsensi(id_karyawan, shift_id, hadir) {
      return axios
        .get(`${API_KEY}cek_aktif`, {
          params: {
            id_karyawan: id_karyawan,
            shift_id: shift_id,
            hadir: hadir,
          },
        })
        .then((response) => {
          return response.status;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    async start(id, hadir, bonus, shift) {
      const status = await this.cekAktifAbsensi(id, shift, hadir);

      const data = {
        id_karyawan: id,
        hadir: hadir,
        bonus: bonus,
        shift: shift,
      };

      if (status == 200) {
        await axios
          .post(`${API_KEY}start_presensi`, data)
          .then((response) => {
            SweetAlertHelper.success('Berhasil!', response.data.msg);
            this.getAbsen();
          })
          .catch((error) => {
            console.log(error.response);
          });
      } else if (status == 202) {
        SweetAlertHelper.confirm('Crash Absensi!', 'Apakah direset ualang?').then(async (result) => {
          if (result.isConfirmed) {
            try {
              // Pertama, jalankan permintaan delete
              const deleteResponse = await axios.delete(`${API_KEY}reset`, {
                params: {
                  id_karyawan: id,
                  shift_id: shift,
                  hadir: hadir,
                },
              });

              if (deleteResponse.status === 200) {
                SweetAlertHelper.success('Berhasil!', 'Absensi direset ulang.');
              }

              // Kemudian, jalankan permintaan post setelah permintaan delete selesai
              const postResponse = await axios.post(`${API_KEY}start_presensi`, data);
              SweetAlertHelper.success('Berhasil!', postResponse.data.msg);
              this.getAbsen();
            } catch (error) {
              console.log(error.response);
            }
          }
        });
      }
    },
  },
};
</script>
