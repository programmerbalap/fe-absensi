<template>
  <main id="main" class="main bg-primary vh-100">
    <section class="section dashboard">
      <div class="card text-center">
        <h4 class="card-header">Selamat Datang!</h4>
        <div class="card-body p-4">
          <img src="@/assets/img/profile-img.jpg" alt="Profile" class="rounded-circle" />
          <h5 class="card-title">{{ dataMeKaryawan.nama }}</h5>
          <h5 style="margin-top: -23px">{{ jabatan }}</h5>

          <div class="pt-2">
            <p class="card-text">Presensi Saya</p>
            <p class="card-text" style="margin-top: -18px">{{ tanggalSekarang }}</p>
          </div>
          <img width="220" height="220" :src="dataMeKaryawan.code_qr" alt="" />
          <div>
            <button type="button" class="btn btn-danger btn-sm mx-1 px-2"><i class="bi bi-stop-circle"></i> Absent</button>
            <button type="button" class="btn btn-success btn-sm mx-1 px-2"><i class="bi bi-skip-start-circle"></i> Present</button>
          </div>
        </div>
        <div class="card-footer text-muted">01.20.48</div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
// import router from '@/router';

export default {
  data() {
    return {
      tanggalSekarang: '',
      dataMeKaryawan: {},
      jabatan: '',
    };
  },

  methods: {
    getTanggalSekarang() {
      const currentUTC = new Date();
      const wibOffset = 7 * 60;
      const currentWIB = new Date(currentUTC.getTime() + wibOffset * 60 * 1000);
      const now = currentWIB.toISOString().slice(0, 10);
      const date = new Date(now);
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const dayName = dayNames[date.getDay()];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      this.tanggalSekarang = `${dayName}, ${day} ${month} ${year}`;
    },

    async generateQr() {
      try {
        const response = await axios.get(`generateQrCode`);
        this.statusPresensiHariIni = response.data.data;
        this.createChartPersentaseHariIni();
      } catch (error) {
        // router.push({ name: 'Eror', params: { msg: error } });
        console.log(error.response);
      }
    },

    async getMe() {
      const token = localStorage.getItem('accessToken');
      await axios
        .get(`me`, {
          headers: {
            'x-access-token': token,
          },
        })
        .then((response) => {
          this.dataMe = response.data;
          this.dataMeKaryawan = response.data.karyawan;
          this.jabatan = response.data.karyawan.jabatan.nama;
          this.provinsi = response.data.karyawan.provinsi.nama;
          this.kota = response.data.karyawan.kota.nama;
          this.kecamatan = response.data.karyawan.kecamatan.nama;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
  },

  mounted() {
    this.getTanggalSekarang();
    this.getMe();
  },
};
</script>
