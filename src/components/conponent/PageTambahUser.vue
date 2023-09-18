<template>
  <div class="modal fade" id="modalTambahUser" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <h4 class="d-block w-full text-center py-4 mb-0">Form Tambah User</h4>
        <button type="button" class="btn-close position-absolute top-0 end-0 p-3 bg-light m-2" data-bs-dismiss="modal" aria-label="Close"></button>
        <div class="modal-body">
          <form class="row g-3">
            <div class="col-md-12">
              <label class="form-label">Nama Karyawan</label>
              <select v-model="formData.id_karyawan" class="form-select" required>
                <option selected>Pilih Nama ...</option>
                <option v-for="item in dataKaryawan" :key="item.karyawan.id" :value="item.karyawan.id">{{ item.karyawan.nama }}</option>
              </select>
              <div class="text-danger fst-italic">{{ err_user }}</div>
            </div>
            <div class="col-md-12">
              <label for="input1" class="form-label">Email</label>
              <input v-model="formData.email" type="text" class="form-control" id="input1" />
              <div class="text-danger fst-italic">{{ err_email }}</div>
            </div>
            <div class="col-md-12">
              <label for="input2" class="form-label">Password</label>
              <input v-model="formData.password" type="text" class="form-control" id="input2" />
              <!-- <div class="text-danger fst-italic">{{ p }}</div> -->
            </div>
            <div class="col-md-12">
              <label for="input2" class="form-label">Password</label>
              <input v-model="formData.confirm_password" type="text" class="form-control" id="input2" />
              <div class="text-danger fst-italic">{{ err_konfirm }}</div>
            </div>
          </form>
          <!-- End Multi Columns Form -->
        </div>
        <div class="text-danger fst-italic text-center">{{ err_required }}</div>
        <div class="modal-footer">
          <button type="button" @click="clearForm" class="btn btn-danger">Bersih</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
          <button type="button" @click="simpanData" class="btn btn-primary" data-bs-dismiss="">Simpan</button>
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
  name: 'PageTambahUser',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        confirm_password: '',
        id_karyawan: '',
      },
      dataKaryawan: [],
      err_user: '',
      err_email: '',
      err_konfirm: '',
      err_required: '',
    };
  },

  methods: {
    clearForm() {
      this.formData = {
        email: '',
        password: '',
        confirm_password: '',
        id_karyawan: '',
      };
    },

    async simpanData() {
      if (!this.formData.id_karyawan || !this.formData.email || !this.formData.password || !this.formData.confirm_password) {
        this.err_required = 'Pastikan data diisi semua!';
      }
      try {
        const response = await axios.post(`${API_KEY}user/ `, this.formData);
        if (response.status === 201) {
          SweetAlertHelper.success('Berhasil!', 'User telah ditambahkan!');
          this.clearForm();
          this.refresData();
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.err_user = error.response.data.err_user;
          this.err_email = error.response.data.err_email;
          this.err_null = '';
        } else if (error.response && error.response.status === 400) {
          this.err_konfirm = error.response.data.err_konfirm;
          this.err_email = '';
          this.err_user = '';
        } else {
          router.push({ name: 'Eror', params: { msg: error } });
        }
      }
    },

    refresData() {
      this.$emit('get-data-user');
    },
  },

  mounted() {
    axios
      .get(`karyawan`, {
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
};
</script>
