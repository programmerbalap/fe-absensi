<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />

    <section class="section dashboard">
      <div class="card">
        <div class="card-body">
          <button type="button" class="btn btn-primary m-4" data-bs-toggle="modal" data-bs-target="#modalTambahUser">+ Tambah</button>
          <page-tambah-user @get-data-user="getUser" />
          <!-- Table with hoverable rows -->
          <div :class="['scroll-container', defaultColorScrollbar, changeColorScrollbar]" @mousemove="handleMouseMove">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col" class="text-center" style="min-width: 300px">Nama</th>
                  <th scope="col">Jabatan</th>
                  <th scope="col" class="text-center" style="min-width: 300px">Email</th>
                  <th scope="col">Password</th>
                  <th scope="col" class="text-center" style="min-width: 300px">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dataUser.data" :key="item.id">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ item.karyawan.nama }}</td>
                  <td>{{ item.karyawan.jabatan.nama }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.password }}</td>
                  <td>
                    <button @click="editById(item.id)" class="btn btn-success mx-1" data-bs-toggle="modal" data-bs-target="#modalEditUser">Edit</button>
                    <page-edit-user :dataUse="dataUserById" @get-data-user="getUser" />
                    <button @click="hapus(item.id)" class="btn btn-danger mx-1">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- End Table with hoverable rows -->
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import PageTitle from './conponent/PageTitle.vue';
import PageTambahUser from './conponent/PageTambahUser.vue';
import router from '@/router';
import SweetAlertHelper from '@/SweetAlertHelper/SweetAlertHelper';
import PageEditUser from './conponent/PageEditUser.vue';
import { API_KEY } from '../../env';

export default {
  components: {
    PageTitle,
    PageTambahUser,
    PageEditUser,
  },
  data() {
    return {
      defaultColorScrollbar: 'default-color-scroll',
      changeColorScrollbar: '',
      scrollTimer: null,
      pageTitle: 'User',
      dataUser: [],
      dataUserById: {},
      msg: 'Data berhasil dihapus!',
    };
  },

  methods: {
    async hapus(id) {
      SweetAlertHelper.confirm('Apakah yakin?', 'Data akan dihapus secara permanen.').then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${API_KEY}user/${id}`)
            .then((response) => {
              if (response.status === 204) {
                SweetAlertHelper.success('Berhasil!', 'Data telah dihapus.');
                this.getUser();
              }
            })
            .catch((error) => {
              router.push({ name: 'Eror', params: { msg: error } });
            });
        }
      });
    },

    async getUser() {
      const token = localStorage.getItem('accessToken');
      axios
        .get(`${API_KEY}user`, {
          headers: {
            'x-access-token': token,
          },
        })
        .then((response) => {
          this.dataUser = response.data;
        })
        .catch((error) => {
          router.push({ name: 'Eror', params: { msg: error } });
          
        });
    },

    async editById(id) {
      axios
        .get(`${API_KEY}user/${id}`)
        .then((response) => {
          this.dataUserById = response.data.data;
        })
        .catch((error) => {
          router.push({ name: 'Eror', params: { msg: error } });
        });
    },
  },
  mounted() {
    this.changeColorScrollbar = this.defaultColorScrollbar;
    this.getUser();
  },
};
</script>
