<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />
    <section class="section profile">
      <div class="row">
        <div class="col-xl-4">
          <div class="card">
            <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
              <img :src="getUrl(dataMe.foto)" alt="Profile" class="rounded-circle" />
              <h2 class="text-center">{{ dataMeKaryawan.nama }}</h2>
              <h3>{{ jabatan }}</h3>
              <div class="social-links mt-2">
                <a href="#" class="twitter"><i class="bi bi-twitter"></i></a>
                <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
                <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
                <a href="#" class="linkedin"><i class="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-8">
          <div class="card">
            <div class="card-body pt-3">
              <!-- Bordered Tabs -->
              <ul class="nav nav-tabs nav-tabs-bordered">
                <li class="nav-item">
                  <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                </li>

                <li class="nav-item">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                </li>

                <li class="nav-item">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Ganti Password</button>
                </li>
              </ul>
              <div class="tab-content pt-2">
                <div class="tab-pane fade show active profile-overview" id="profile-overview">
                  <h5 class="card-title">Detail Profil</h5>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Nama Lenglkap</div>
                    <div class="col-lg-9 col-md-8">{{ dataMeKaryawan.nama }}</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Nomor NIK</div>
                    <div class="col-lg-9 col-md-8">{{ dataMeKaryawan.no_nik }}</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Jenis Kelamin</div>
                    <div class="col-lg-9 col-md-8">{{ dataMeKaryawan.jenis_kelamin }}</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Jabatan</div>
                    <div class="col-lg-9 col-md-8">{{ jabatan }}</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Tempat Tanggal Lahir</div>
                    <div class="col-lg-9 col-md-8">{{ dataMeKaryawan.tmp_lhr }}, {{ dataMeKaryawan.tgl_lhr }}</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Provinsi</div>
                    <div class="col-lg-9 col-md-8">{{ provinsi }}</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Kabupaten</div>
                    <div class="col-lg-9 col-md-8">{{ kota }}</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Kecamatan</div>
                    <div class="col-lg-9 col-md-8">{{ kecamatan }}</div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">No Telp</div>
                    <div class="col-lg-9 col-md-8">{{ dataMeKaryawan.nomor_telepon }}</div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Email</div>
                    <div class="col-lg-9 col-md-8">{{ dataMe.email }}</div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Nomor Rekening</div>
                    <div class="col-lg-9 col-md-8">{{ dataMeKaryawan.no_rekening }}</div>
                  </div>
                </div>

                <div class="tab-pane fade profile-edit pt-3" id="profile-edit">
                  <!-- Profile Edit Form -->
                  <form>
                    <div class="row mb-3">
                      <p class="col-md-4 col-lg-3 col-form-label">Profile Image</p>
                      <div class="col-md-8 col-lg-9">
                        <img :src="getUrl(dataMe.foto)" alt="Profile" />
                        <div class="pt-2">
                          <button class="btn btn-primary btn-sm" title="Upload new profile image"><i class="bi bi-upload"></i></button>
                          <a href="#" class="btn btn-danger btn-sm" title="Remove my profile image"><i class="bi bi-trash"></i></a>
                        </div>
                      </div>
                    </div>

                    <div class="text-center">
                      <button type="submit" class="btn btn-primary">Simpan</button>
                    </div>
                  </form>
                  <!-- End Profile Edit Form -->
                </div>

                <div class="tab-pane fade pt-3" id="profile-change-password">
                  <!-- Change Password Form -->
                  <form>
                    <div class="row mb-3">
                      <label for="currentPassword" class="col-md-4 col-lg-3 col-form-label">Password Lama</label>
                      <div class="col-md-8 col-lg-9">
                        <input v-model="formData.password_lama" type="password" class="form-control" id="currentPassword" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="newPassword" class="col-md-4 col-lg-3 col-form-label">Password Baru</label>
                      <div class="col-md-8 col-lg-9">
                        <input v-model="formData.password_baru" type="password" class="form-control" id="newPassword" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="renewPassword" class="col-md-4 col-lg-3 col-form-label">Confirmasi Password</label>
                      <div class="col-md-8 col-lg-9">
                        <input v-model="formData.konfirmasi_password" type="password" class="form-control" id="renewPassword" />
                      </div>
                    </div>

                    <div class="text-danger fst-italic text-center">{{ err_required }}</div>
                    <div class="text-center">
                      <button type="button" @click="simpan(dataMe.id)" class="btn btn-primary">Save</button>
                    </div>
                  </form>
                  <!-- End Change Password Form -->
                </div>
              </div>
              <!-- End Bordered Tabs -->
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
import SweetAlertHelper from '@/SweetAlertHelper/SweetAlertHelper';
import router from '@/router';
import { API_KEY } from '../../env';

export default {
  components: {
    PageTitle,
  },
  data() {
    return {
      pageTitle: 'My Profile',
      dataMe: {},
      dataMeKaryawan: {},
      jabatan: '',
      provinsi: '',
      kota: '',
      kecamatan: '',
      formData: {
        password_lama: '',
        password_baru: '',
        konfirmasi_password: '',
      },
      err_required: '',
    };
  },

  methods: {
    getUrl(item) {
      return `${API_KEY}${item}`;
    },

    clearForm() {
      this.formData = {
        password_lama: '',
        password_baru: '',
        konfirmasi_password: '',
        err_required: '',
      };
    },

    async simpan(id) {
      if (!this.formData.password_lama || !this.formData.password_baru || !this.formData.konfirmasi_password) {
        this.err_required = 'Pastikan data diisi!';
      } else if (this.formData.password_baru != this.formData.konfirmasi_password) {
        this.err_required = 'Konfirmasi password salah!';
      } else {
        try {
          const response = await axios.patch(`${API_KEY}edit_password_me/${id}`, this.formData);
          if (response.status === 200) {
            SweetAlertHelper.success('Berhasil!', response.data.msg);
            this.clearForm();
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            this.err_required = 'Password lama tidak diketahui!';
          } else {
            router.push({ name: 'Eror', params: { msg: error } });
          }
        }
      }
    },
  },

  mounted() {
    const token = localStorage.getItem('accessToken');
    axios
      .get(`${API_KEY}me`, {
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
        router.push({ name: 'Eror', params: { msg: error } });
      });
  },
};
</script>
