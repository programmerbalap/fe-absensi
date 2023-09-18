import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MainView from '../views/MainView .vue';

import DashboardView from '../components/DashboardView.vue';
import AbsensiView from '../components/AbsensiView.vue';
import AbsensiAktifView from '../components/AbsensiAktifView.vue';
import KaryawanView from '../components/KaryawanView.vue';
import LaporanAbsensi from '../components/LapAbsensiView.vue';
import LaporanGaji from '../components/LapGajiView.vue';
import AkunView from '../components/AkunView.vue';
import MyProfile from '../components/ProfileViiew.vue';
import ProfileStg from '../components/StgViiew.vue';
import PengaturanView from '../components/PengaturanView.vue';
import DetailAbsensiView from '../components/DetailAbsensiView.vue';
import PemulihanViewVue from '@/components/PemulihanView.vue';
import ErorView from '../components/ErorView.vue';
import HomeViewVue from '@/components/user/HomeView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/eror/:msg',
    name: 'Eror',
    component: ErorView,
  },
  {
    path: '/dashboard/',
    name: 'Main',
    component: MainView,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardView,
      },
      {
        path: '/karyawan',
        name: 'Karyawan',
        component: KaryawanView,
      },
      {
        path: '/absensi',
        name: 'Absensi',
        component: AbsensiView,
      },
      {
        path: '/absensi_aktif',
        name: 'AbsensiAktif',
        component: AbsensiAktifView,
      },
      {
        path: '/pemulihan',
        name: 'Pemulihan',
        component: PemulihanViewVue,
      },
      {
        path: '/detail_absensi',
        name: 'DetailAbsensi',
        component: DetailAbsensiView,
      },
      {
        path: '/lap_absensi',
        name: 'LapoaranAbsensi',
        component: LaporanAbsensi,
      },
      {
        path: '/lap_gaji',
        name: 'LaporanGaji',
        component: LaporanGaji,
      },
      {
        path: '/pengaturan',
        name: 'Pengaturan',
        component: PengaturanView,
      },
      {
        path: '/akun',
        name: 'Akun',
        component: AkunView,
      },
      {
        path: '/my_profile',
        name: 'MyProfile',
        component: MyProfile,
      },
      {
        path: '/profile_stg',
        name: 'ProfileStg',
        component: ProfileStg,
      },
      {
        path: '/home',
        name: 'Home',
        component: HomeViewVue,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
