<template>
  <div class="modal fade" id="modal-tambah-karyawan" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <h4 class="d-block w-full text-center py-4 mb-0">Form Tambah Karyawan</h4>
        <button type="button" class="btn-close position-absolute top-0 end-0 p-3 bg-light m-2" data-bs-dismiss="modal" aria-label="Close"></button>
        <div class="modal-body">
          <form class="row g-3">
            <div class="col-md-12">
              <label for="input1" class="form-label">Nama</label>
              <input v-model="formData.nama" type="text" class="form-control" id="input1" required />
            </div>
            <div class="col-md-12">
              <label for="input2" class="form-label">NIK</label>
              <input v-model="formData.no_nik" type="number" class="form-control" id="input2" />
            </div>
            <div class="col-md-12">
              <label for="jabatan" class="form-label">Jabatan</label>
              <select v-model="formData.id_jabatan" class="form-select" id="jabatan">
                <option selected>.....</option>
                <option v-for="jbt in jabatan" :key="jbt.id" :value="jbt.id">{{ jbt.nama }}</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="form-label">Jenis Kelamin</label>
              <div class="d-flex">
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="formData.jenis_kelamin" id="lk" value="Laki-laki" checked />
                  <label class="form-check-label" for="lk"> Laki-laki </label>
                </div>
                <div class="form-check ms-4">
                  <input class="form-check-input" type="radio" v-model="formData.jenis_kelamin" id="pr" value="Perempuan" />
                  <label class="form-check-label" for="pr"> Perempuan </label>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <label for="input4" class="pb-2">Tempat lahir</label>
              <input v-model="formData.tmp_lhr" type="text" class="form-control" id="input4" />
            </div>
            <div class="col-md-12">
              <label class="pb-2">Tanggal Lahir</label>
              <input v-model="formData.tgl_lhr" type="date" class="form-control" />
            </div>
            <div class="col-md-12">
              <label class="form-label">Provinsi</label>
              <select v-model="formData.kode_provinsi" class="form-select">
                <option selected>.....</option>
                <option v-for="provinsi in provinses" :key="provinsi.id" :value="provinsi.id">{{ provinsi.nama }}</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="form-label">Kabupaten/Kota</label>
              <select v-model="formData.kode_kabupaten" class="form-select">
                <option selected>.....</option>
                <option v-for="kab in kabupaten()" :key="kab.id" :value="kab.id">{{ kab.nama }}</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="form-label">Kecamatan</label>
              <select v-model="formData.kode_kecamatan" class="form-select">
                <option selected>.....</option>
                <option v-for="kecamat in kecamatan_()" :key="kecamat.id" :value="kecamat.id">{{ kecamat.nama }}</option>
              </select>
            </div>
            <div class="col-md-12">
              <label for="input5" class="form-label">Nomor Telepon / WhatsApp</label>
              <input v-model="formData.nomor_telepon" type="number" class="form-control" id="input5" />
            </div>
            <div class="col-md-12">
              <label for="input6" class="form-label">Nomor Rekening</label>
              <input v-model="formData.no_rekening" type="number" class="form-control" id="input6" />
            </div>
          </form>
          <!-- End Multi Columns Form -->
        </div>
        <div class="text-danger fst-italic text-center">{{ err_required }}</div>
        <div class="modal-footer">
          <button type="button" @click="clearForm" class="btn btn-danger">Clear</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" @click="simpanData" class="btn btn-primary" data-bs-dismiss="">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import SweetAlertHelper from '@/SweetAlertHelper/SweetAlertHelper';
import { API_KEY } from '../../../env';

export default {
  inject: ['accessToken'],
  name: 'PageTambahKaryawan',
  data() {
    return {
      formData: {
        nama: '',
        no_nik: '',
        id_jabatan: '',
        jenis_kelamin: 'Laki-laki', // Default value for radio button
        tmp_lhr: '',
        tgl_lhr: '',
        kode_provinsi: '',
        kode_kabupaten: '',
        kode_kecamatan: '',
        nomor_telepon: '',
        no_rekening: '',
      },
      provinses: [],
      kota: [],
      kecamatan: [],
      jabatan: [],
      err_required: '',
    };
  },
  methods: {
    async getProvinsi() {
      const response = await axios.get(`${API_KEY}provinsi`);
      this.provinses = response.data.data;
    },
    async getKota() {
      const response = await axios.get(`${API_KEY}kota`);
      this.kota = response.data.data;
    },
    kabupaten() {
      if (this.formData.kode_provinsi) {
        return this.kota.filter((kt) => kt.id_provinsi == this.formData.kode_provinsi);
      }
      return [];
    },
    async getKecamatan() {
      const response = await axios.get(`${API_KEY}kecamatan`);
      this.kecamatan = response.data.data;
    },
    kecamatan_() {
      if (this.formData.kode_kabupaten) {
        return this.kecamatan.filter((keca) => keca.id_kota == this.formData.kode_kabupaten);
      }
      return [];
    },
    async getJabatan() {
      const response = await axios.get(`${API_KEY}jabatan`, {
        headers: {
          'x-access-token': this.accessToken,
        },
      });
      this.jabatan = response.data.data;
    },

    refresKaryawan() {
      this.$emit('get-data-karyawan');
    },

    async simpanData() {
      if (
        !this.formData.nama ||
        !this.formData.no_nik ||
        !this.formData.id_jabatan ||
        !this.formData.jenis_kelamin ||
        !this.formData.tmp_lhr ||
        !this.formData.tgl_lhr ||
        !this.formData.kode_provinsi ||
        !this.formData.kode_kabupaten ||
        !this.formData.kode_kabupaten ||
        !this.formData.nomor_telepon ||
        !this.formData.no_rekening
      ) {
        this.err_required = 'Pastikan data diisi semua!';
      } else {
        try {
          const response = await axios.post(`${API_KEY}karyawan/`, this.formData);
          if (response.status === 201) {
            SweetAlertHelper.success('Berhasil!', response.data.msg);
            router.push('/karyawan');
            this.clearForm();
            this.refresKaryawan();
          }
        } catch (error) {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        }
      }
    },
    clearForm() {
      (this.formData = {
        nama: '',
        no_nik: '',
        id_jabatan: '',
        jenis_kelamin: 'Laki-laki',
        tmp_lhr: '',
        tgl_lhr: '',
        kode_provinsi: '',
        kode_kabupaten: '',
        kode_kecamatan: '',
        nomor_telepon: '',
        no_rekening: '',
      }),
        (this.err_required = '');
    },
  },

  mounted() {
    this.getProvinsi();
    this.getKota();
    this.getKecamatan();
    this.getJabatan();
  },
};
</script>
