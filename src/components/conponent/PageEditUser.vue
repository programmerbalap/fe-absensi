<template>
  <div class="modal fade" id="modalEditUser" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <h4 class="d-block w-full text-center py-4 mb-0">Form Edit User</h4>
        <button type="button" class="btn-close position-absolute top-0 end-0 p-3 bg-light m-2" data-bs-dismiss="modal" aria-label="Close"></button>
        <div class="modal-body">
          <form class="row g-3">
            <div class="col-md-12">
              <label for="input1" class="form-label">Email</label>
              <input disabled v-model="formData.email" type="text" class="form-control" id="input1" />
              <div class="text-danger fst-italic">{{ err_email }}</div>
            </div>
            <div class="col-md-12">
              <label for="input2" class="form-label">Password</label>
              <input v-model="formData.password" type="text" class="form-control" id="input2" />
              <!-- <div class="text-danger fst-italic">{{ p }}</div> -->
            </div>
          </form>
          <!-- End Multi Columns Form -->
        </div>
        <div class="text-danger fst-italic text-center">{{ err_required }}</div>
        <div class="modal-footer">
          <button type="button" @click="clearForm" class="btn btn-danger">Bersih</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
          <button type="button" @click="ubahData(formData.id)" class="btn btn-primary" data-bs-dismiss="">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// import router from '@/router';
import SweetAlertHelper from '@/SweetAlertHelper/SweetAlertHelper';
import { API_KEY } from '../../../env';

export default {
  name: 'PageEditUser',
  props: {
    dataUse: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      formData: {
        id: '',
        email: '',
        password: '',
      },
      err_required: '',
      err_email: '',
    };
  },

  watch: {
    dataUse: {
      immediate: true,
      handler(newData) {
        this.formData.id = newData.id;
        this.formData.email = newData.email;
        this.formData.password = newData.password;
      },
    },
  },

  methods: {
    clearForm() {
      this.formData = {
        password: '',
      };
    },
    async ubahData(id) {
      if (!this.formData.password) {
        this.err_required = 'Pastikan data diisi!';
      } else {
        try {
          const response = await axios.patch(`${API_KEY}user/${id}`, this.formData);
          if (response.status === 200) {
            SweetAlertHelper.success('Berhasil!', response.data.msg);
            this.clearForm();
            this.refresData();
          }
        } catch (error) {
          // router.push({ name: 'Eror', params: { msg: error } });
          console.log(error.response);
        }
      }
    },
    refresData() {
      this.$emit('get-data-user');
    },
  },
};
</script>
