<template>
  <div>
    <!-- ======= Header ======= -->
    <header id="header" class="header fixed-top d-flex align-items-center">
      <div class="d-flex align-items-center justify-content-between">
        <a href="index.html" class="logo d-flex align-items-center">
          <img src="../assets/img/logo.png" alt="" />
          <span class="d-none d-lg-block">S.T.G.</span>
        </a>
        <i @click="toggleSidebar" class="bi bi-list toggle-sidebar-btn"></i>
      </div>
      <!-- End Logo -->
      <div class="search-bar">
        <div class="search-form d-flex align-items-center">
          <input v-model="searchQuery" @input="onSearch" placeholder="Search..." type="text" title="Enter search keyword" v-if="false" />
          <!-- <button type="submit" title="Search"><i class="bi bi-search"></i></button> -->
        </div>
      </div>
      <!-- End Search Bar -->
      <nav class="header-nav ms-auto">
        <ul class="d-flex align-items-center">
          <li class="nav-item d-block d-lg-none" v-if="false">
            <a class="nav-link nav-icon search-bar-toggle" href="#">
              <i class="bi bi-search"></i>
            </a>
          </li>
          <!-- End Search Icon-->
          <button v-if="false" type="button" @click="clear" class="btn btn-outline-warning mx-1">Clear</button>
          <button v-if="false" type="button" @click="_exports" class="btn btn-outline-danger ms-1 me-3">Export</button>

          <!-- <li class="nav-item dropdown">
            <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
              <i class="bi bi-bell"></i>
              <span class="badge bg-primary badge-number">4</span>
            </a>

            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
              <li class="dropdown-header">
                You have 4 new notifications
                <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li class="notification-item">
                <i class="bi bi-exclamation-circle text-warning"></i>
                <div>
                  <h4>Lorem Ipsum</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>30 min. ago</p>
                </div>
              </li>

              <li>
                <hr class="dropdown-divider" />
              </li>

              <li class="notification-item">
                <i class="bi bi-x-circle text-danger"></i>
                <div>
                  <h4>Atque rerum nesciunt</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>1 hr. ago</p>
                </div>
              </li>

              <li>
                <hr class="dropdown-divider" />
              </li>

              <li class="notification-item">
                <i class="bi bi-check-circle text-success"></i>
                <div>
                  <h4>Sit rerum fuga</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>2 hrs. ago</p>
                </div>
              </li>

              <li>
                <hr class="dropdown-divider" />
              </li>

              <li class="notification-item">
                <i class="bi bi-info-circle text-primary"></i>
                <div>
                  <h4>Dicta reprehenderit</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>4 hrs. ago</p>
                </div>
              </li>

              <li>
                <hr class="dropdown-divider" />
              </li>
              <li class="dropdown-footer">
                <a href="#">Show all notifications</a>
              </li>
            </ul>
          </li> -->
          <!-- End Notification Nav -->
          <!-- 
          <li class="nav-item dropdown">
            <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
              <i class="bi bi-chat-left-text"></i>
              <span class="badge bg-success badge-number">3</span>
            </a>

            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
              <li class="dropdown-header">
                You have 3 new messages
                <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li class="message-item">
                <a href="#">
                  <img src="assets/img/messages-1.jpg" alt="" class="rounded-circle" />
                  <div>
                    <h4>Maria Hudson</h4>
                    <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                    <p>4 hrs. ago</p>
                  </div>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li class="message-item">
                <a href="#">
                  <img src="assets/img/messages-2.jpg" alt="" class="rounded-circle" />
                  <div>
                    <h4>Anna Nelson</h4>
                    <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                    <p>6 hrs. ago</p>
                  </div>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li class="message-item">
                <a href="#">
                  <img src="assets/img/messages-3.jpg" alt="" class="rounded-circle" />
                  <div>
                    <h4>David Muldon</h4>
                    <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                    <p>8 hrs. ago</p>
                  </div>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li class="dropdown-footer">
                <a href="#">Show all messages</a>
              </li>
            </ul>
          </li> -->
          <!-- End Messages Nav -->

          <li class="nav-item dropdown pe-3">
            <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
              <img src="../assets/img/profile-img.jpg" alt="Profile" class="rounded-circle" />
              <span class="d-none d-md-block dropdown-toggle ps-2">M. Subhan</span> </a
            ><!-- End Profile Iamge Icon -->
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li class="dropdown-header">
                <h6>Muhammad Subhan</h6>
                <span>Backend Web Development</span>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li>
                <router-link class="dropdown-item d-flex align-items-center" to="/my_profile">
                  <i class="bi bi-person"></i>
                  <span>My Profile</span>
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li>
                <a class="dropdown-item d-flex align-items-center" href="">
                  <i class="bi bi-gear"></i>
                  <span>Account Settings</span>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li>
                <a class="dropdown-item d-flex align-items-center" href="">
                  <i class="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <button @click="logout" class="dropdown-item d-flex align-items-center" href="#">
                  <i class="bi bi-box-arrow-right"></i>
                  <span>Log Out</span>
                </button>
              </li>
            </ul>
            <!-- End Profile Dropdown Items -->
          </li>
          <!-- End Profile Nav -->
        </ul>
      </nav>
      <!-- End Icons Navigation -->
    </header>
    <!-- End Header -->

    <!-- ======= Sidebar ======= -->
    <aside class="sidebar">
      <ul class="sidebar-nav" id="sidebar-nav">
        <li class="nav-item">
          <a class="nav-link" href="dashboard">
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
          <a class="nav-link" href="home">
            <i class="bi bi-grid"></i>
            <span>Home</span>
          </a>
        </li>
        <!-- End Dashboard Nav -->

        <li class="nav-item">
          <a class="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#"> <i class="bi bi-menu-button-wide"></i><span>Karyawan</span><i class="bi bi-chevron-down ms-auto"></i> </a>
          <ul id="components-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <a href="karyawan"> <i class="bi bi-circle"></i><span>Data Karyawan</span> </a>
            </li>
          </ul>
        </li>
        <!-- End Karyawans Nav -->

        <li class="nav-item">
          <a class="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#"> <i class="bi bi-journal-text"></i><span>Absensi</span><i class="bi bi-chevron-down ms-auto"></i> </a>
          <ul id="forms-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <a href="absensi"> <i class="bi bi-circle"></i><span>Absensi</span> </a>
            </li>
            <li>
              <a href="absensi_aktif"> <i class="bi bi-circle"></i><span>Absensi Aktif</span> </a>
            </li>
            <li>
              <a href="pemulihan"> <i class="bi bi-circle"></i><span>Pemulihan</span> </a>
            </li>
            <li>
              <a href="detail_absensi"> <i class="bi bi-circle"></i><span>Detail Absensi</span> </a>
            </li>
          </ul>
        </li>
        <!-- End Absensi Nav -->

        <li class="nav-item">
          <a class="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" href="#"> <i class="bi bi-layout-text-window-reverse"></i><span>Laporan</span><i class="bi bi-chevron-down ms-auto"></i> </a>
          <ul id="tables-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <a href="lap_absensi"> <i class="bi bi-circle"></i><span>laporan Absensi</span> </a>
            </li>
            <li>
              <a href="lap_gaji"> <i class="bi bi-circle"></i><span>laporan gaji</span> </a>
            </li>
          </ul>
        </li>
        <!-- End laporan Nav -->

        <li class="nav-item">
          <a class="nav-link collapsed" data-bs-target="#charts-nav" data-bs-toggle="collapse" href="#"> <i class="bi bi-bar-chart"></i><span>Master STG</span><i class="bi bi-chevron-down ms-auto"></i> </a>
          <ul id="charts-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <a href="pengaturan"> <i class="bi bi-circle"></i><span>Pengaturan</span> </a>
            </li>
            <li>
              <a href="akun"> <i class="bi bi-circle"></i><span>Akun</span> </a>
            </li>
          </ul>
        </li>
        <li class="nav-heading">Pages</li>
        <li class="nav-item">
          <a class="nav-link collapsed" href="/profile_stg">
            <i class="bi bi-person"></i>
            <span>Profile STG</span>
          </a>
        </li>
      </ul>
    </aside>
    <!-- End Sidebar-->
    <router-view :searchResults="searchQuery" :exports_status="exports_"></router-view>
  </div>
</template>

<script>
import router from '@/router';
import SweetAlertHelper from '@/SweetAlertHelper/SweetAlertHelper';
import axios from 'axios';
import { API_KEY } from '../../env';

export default {
  data() {
    return {
      isSidebarOpen: false,
      searchQuery: '',
      exports_: false,
    };
  },

  mounted() {
    const token = localStorage.getItem('accessToken');
    if (!token) router.push('/');
  },
  methods: {
    _exports() {
      this.exports_ = !this.exports_;
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      if (this.isSidebarOpen) {
        document.body.classList.add('toggle-sidebar');
      } else {
        document.body.classList.remove('toggle-sidebar');
      }
    },

    logout() {
      axios
        .post(`${API_KEY}logout`)
        .then((response) => {
          if (response.status === 200) {
            SweetAlertHelper.confirm('Yakin keluar?', 'Jika keluar anda harus login kembali!').then((result) => {
              if (result.isConfirmed) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('shift');
                SweetAlertHelper.success('Berhasil!', 'Data telah dihapus.');
                router.push('/');
              }
            });
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            SweetAlertHelper.error('Gagal', 'Pastikan tidak ada absensi berjalan!');
          } else {
            router.push({ name: 'Eror', params: { msg: error } });
          }
        });
    },
  },
};
</script>
