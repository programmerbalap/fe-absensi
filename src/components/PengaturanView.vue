<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />

    <section class="section dashboard">
      <div class="card">
        <div class="card-body py-4">
          <!-- Default Tabs -->
          <ul class="nav nav-tabs d-flex" id="myTabjustified" role="tablist">
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100 active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-justified" type="button" role="tab" aria-controls="home" aria-selected="true">Jabatan</button>
            </li>
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-justified" type="button" role="tab" aria-controls="profile" aria-selected="false">Gaji</button>
            </li>
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-justified" type="button" role="tab" aria-controls="contact" aria-selected="false">Shifts</button>
            </li>
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100" id="jam-bonus-tab" data-bs-toggle="tab" data-bs-target="#jam-bonus-justified" type="button" role="tab" aria-controls="jam-bonus" aria-selected="false">Bonus</button>
            </li>
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100" id="jam-efektif-tab" data-bs-toggle="tab" data-bs-target="#jam-efektif-justified" type="button" role="tab" aria-controls="jam-efektif" aria-selected="false">Jam Kerja</button>
            </li>
          </ul>
          <div class="tab-content" id="myTabjustifiedContent">
            <!-- JABATAN -->
            <div class="tab-pane fade show active" id="home-justified" role="tabpanel" aria-labelledby="home-tab">
              <table class="table table-hover">
                <thead style="background-color: #757bff">
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Jabatan</th>
                    <th scope="col">Nominal</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataJabatan.data" :key="item.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ item.nama }}</td>
                    <td>{{ item.gaji.nominal }}</td>
                    <td>
                      <button data-bs-toggle="modal" data-bs-target="#modal-jabatan" @click="getJabatanById(item.id)" class="btn btn-success mx-1">Ubah</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="modal fade" id="modal-jabatan" tabindex="-1" data-bs-backdrop="false">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Edit Jabatan</h5>
                      <button @click="clearErr" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form class="row g-3">
                        <div class="col-md-12">
                          <label class="form-label">Jabatan</label>
                          <input v-model="jabatan.nama" type="text" class="form-control" id="input1" />
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Nominal</label>
                          <select v-model="jabatan.id_gaji" class="form-select">
                            <option v-for="item in dataGaji" :key="item.id" :value="item.id">{{ item.nominal }}</option>
                          </select>
                        </div>
                        <div class="text-danger fst-italic">{{ err_required }}</div>
                      </form>
                    </div>
                    <div class="modal-footer">
                      <button @click="clearErr" type="button" ref="modalButton" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                      <button @click="simpanJabatan(jabatan.id)" type="button" class="btn btn-primary">Simpan</button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End Disabled Backdrop Modal-->
            </div>
            <div class="tab-pane fade" id="profile-justified" role="tabpanel" aria-labelledby="profile-tab">
              <table class="table table-hover">
                <thead style="background-color: #757bff">
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Nominal</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataGaji" :key="item.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ item.nominal }}</td>
                    <td>
                      <button data-bs-toggle="modal" data-bs-target="#modal-gaji" @click="getGajiById(item.id)" class="btn btn-success mx-1">Ubah</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="modal fade" id="modal-gaji" tabindex="-1" data-bs-backdrop="false">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Edit Gaji</h5>
                      <button @click="clearErr" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form class="row g-3">
                        <div class="col-md-12">
                          <label class="form-label">Gaji</label>
                          <input v-model="gaji.nominal" type="text" class="form-control" id="input1" />
                        </div>
                        <div class="text-danger fst-italic">{{ err_required }}</div>
                      </form>
                    </div>
                    <div class="modal-footer">
                      <button @click="clearErr" type="button" ref="modalButton" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                      <button @click="simpanGaji(gaji.id)" type="button" class="btn btn-primary">Simpan</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="contact-justified" role="tabpanel" aria-labelledby="contact-tab">
              <table class="table table-hover">
                <thead style="background-color: #757bff">
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Shift</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataShift" :key="item.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ item.nama }}</td>
                    <td>
                      <button data-bs-toggle="modal" data-bs-target="#modal-shift" @click="getShiftById(item.id)" class="btn btn-success mx-1">Ubah</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="modal fade" id="modal-shift" tabindex="-1" data-bs-backdrop="false">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Edit Shift</h5>
                      <button @click="clearErr" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form class="row g-3">
                        <div class="col-md-12">
                          <label class="form-label">Nama Shift</label>
                          <input v-model="shift.nama" type="text" class="form-control" id="input1" />
                        </div>
                        <div class="text-danger fst-italic">{{ err_required }}</div>
                      </form>
                    </div>
                    <div class="modal-footer">
                      <button @click="clearErr" type="button" ref="modalButton" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                      <button @click="simpanGaji(shift.id)" type="button" class="btn btn-primary">Simpan</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade show" id="jam-bonus-justified" role="tabpanel" aria-labelledby="jab-bonus-tab">
              <table class="table table-hover">
                <thead style="background-color: #757bff">
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Bonus</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataBonus" :key="item.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ item.nominal }}</td>
                    <td>
                      <button @click="getBonusById(item.id)" data-bs-toggle="modal" data-bs-target="#modal-bonus" class="btn btn-success mx-1">Ubah</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="modal fade" id="modal-bonus" tabindex="-1" data-bs-backdrop="false">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Edit Bonus</h5>
                      <button @click="clearErr" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form class="row g-3">
                        <div class="col-md-12">
                          <label class="form-label">Nominal Bonus</label>
                          <input v-model="bonus.nominal" type="text" class="form-control" id="input1" />
                        </div>
                        <div class="text-danger fst-italic">{{ err_required }}</div>
                      </form>
                    </div>
                    <div class="modal-footer">
                      <button @click="clearErr" type="button" ref="modalButton" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                      <button @click="simpanBonus(bonus.id)" type="button" class="btn btn-primary">Simpan</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade show" id="jam-efektif-justified" role="tabpanel" aria-labelledby="jab-efektif-tab">
              <table class="table table-hover">
                <thead style="background-color: #757bff">
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Start</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataJamEfektif" :key="item.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ item.start }}</td>
                    <td>
                      <button @click="getEfektifById(item.id)" data-bs-toggle="modal" data-bs-target="#modal-jam-kerja" class="btn btn-success mx-1">Ubah</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="modal fade" id="modal-jam-kerja" tabindex="-1" data-bs-backdrop="false">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Edit Jam Kerja</h5>
                      <button @click="clearErr" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form class="row g-3">
                        <div class="col-md-12">
                          <label class="form-label">Start</label>
                          <input v-model="efektif.start" type="text" class="form-control" id="input1" />
                        </div>
                        <div class="text-danger fst-italic">{{ err_required }}</div>
                      </form>
                    </div>
                    <div class="modal-footer">
                      <button @click="clearErr" type="button" ref="modalButton" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                      <button @click="simpanJamKerja(efektif.id)" type="button" class="btn btn-primary">Simpan</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Default Tabs -->
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

export default {
  components: {
    PageTitle,
  },
  data() {
    return {
      pageTitle: 'Pengaturan',
      index: 0,
      dataJabatan: [],
      dataGaji: [],
      dataShift: [],
      dataBonus: [],
      dataJamEfektif: [],
      jabatan: {},
      gaji: {},
      shift: {},
      bonus: {},
      efektif: {},
      err_required: '',
    };
  },
  methods: {
    clearErr() {
      this.err_required = '';
    },
    async getDataJabatan() {
      await axios
        .get(`${API_KEY}jabatan`)
        .then((response) => {
          this.dataJabatan = response.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async getJabatanById(id) {
      await axios
        .get(`${API_KEY}jabatan/${id}`)
        .then((response) => {
          this.jabatan = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async simpanJabatan(id) {
      if (!this.jabatan.nama || !this.jabatan.id_gaji) return (this.err_required = 'Pastikan data terisi!');
      await axios
        .patch(`${API_KEY}jabatan/${id}`, {
          nama: this.jabatan.nama,
          id_gaji: this.jabatan.id_gaji,
        })
        .then((response) => {
          SweetAlertHelper.success('Berhasil!', response.data.msg);
          this.getDataJabatan();
          const btn = this.$refs.modalButton;
          btn.click();
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    async getDataGaji() {
      await axios
        .get(`${API_KEY}gaji`)
        .then((response) => {
          this.dataGaji = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async getGajiById(id) {
      await axios
        .get(`${API_KEY}gaji/${id}`)
        .then((response) => {
          this.gaji = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async simpanGaji(id) {
      if (!this.gaji.nominal) return (this.err_required = 'Pastikan data terisi!');
      await axios
        .patch(`${API_KEY}gaji/${id}`, {
          nominal: this.gaji.nominal,
        })
        .then((response) => {
          SweetAlertHelper.success('Berhasil!', response.data.msg);
          this.getDataGaji();
          const btn = this.$refs.modalButton;
          btn.click();
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    async getDataShift() {
      await axios
        .get(`${API_KEY}shift`)
        .then((response) => {
          this.dataShift = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async getShiftById(id) {
      await axios
        .get(`${API_KEY}shift/${id}`)
        .then((response) => {
          this.shift = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async simpanShift(id) {
      if (!this.shift.nama) return (this.err_required = 'Pastikan data terisi!');
      await axios
        .patch(`${API_KEY}shift/${id}`, {
          nama: this.shift.nama,
        })
        .then((response) => {
          SweetAlertHelper.success('Berhasil!', response.data.msg);
          this.getDataShift();
          const btn = this.$refs.modalButton;
          btn.click();
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    async getDataBonus() {
      await axios
        .get(`${API_KEY}bonus`)
        .then((response) => {
          this.dataBonus = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async getBonusById(id) {
      await axios
        .get(`${API_KEY}bonus/${id}`)
        .then((response) => {
          this.bonus = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async simpanBonus(id) {
      if (!this.bonus.nominal) return (this.err_required = 'Pastikan data terisi!');
      await axios
        .patch(`${API_KEY}bonus/${id}`, {
          nominal: this.bonus.nominal,
        })
        .then((response) => {
          SweetAlertHelper.success('Berhasil!', response.data.msg);
          this.getDataBonus();
          const btn = this.$refs.modalButton;
          btn.click();
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },

    async getDataJamKerja() {
      await axios
        .get(`${API_KEY}jam_kerja`)
        .then((response) => {
          this.dataJamEfektif = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async getEfektifById(id) {
      await axios
        .get(`${API_KEY}jam_kerja/${id}`)
        .then((response) => {
          this.efektif = response.data.data;
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
    async simpanJamKerja(id) {
      if (!this.efektif.start) return (this.err_required = 'Pastikan data terisi!');
      await axios
        .patch(`${API_KEY}jam_kerja/${id}`, {
          start: this.efektif.start,
        })
        .then((response) => {
          SweetAlertHelper.success('Berhasil!', response.data.msg);
          this.getDataJamKerja();
          const btn = this.$refs.modalButton;
          btn.click();
        })
        .catch((error) => {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        });
    },
  },
  mounted() {
    this.getDataJabatan();
    this.getDataGaji();
    this.getDataShift();
    this.getDataBonus();
    this.getDataJamKerja();
  },
};
</script>
