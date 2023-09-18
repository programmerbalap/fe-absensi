<template>
  <main id="main" class="main">
    <page-title :title="pageTitle" />

    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-8">
          <div class="card p-4">
            <canvas class="m-2" ref="myChart" style="max-height: 400px"></canvas>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card p-4">
            <canvas class="m-3" ref="persentaseHariIni" style="max-height: 400px"></canvas>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Chart from 'chart.js/auto';
import PageTitle from './conponent/PageTitle.vue';
import axios from 'axios';
import router from '@/router';
import { API_KEY } from '../../env';

export default {
  components: {
    PageTitle,
  },
  data() {
    return {
      pageTitle: 'Dashboard',
      dataPersentase: [],
      statusPresensiHariIni: {},
    };
  },

  props: {
    searchResults: {
      required: true,
    },
  },

  methods: {
    async getPersentasePertahun() {
      try {
        const response = await axios.get(`${API_KEY}persentase`, {
          params: {
            year: new Date().getFullYear(),
          },
        });

        this.dataPersentase = response.data.data;
        console.log(this.dataPersentase);
        this.$nextTick(() => {
          this.createChartPersentasePertahun();
        });
      } catch (error) {
        router.push({ name: 'Eror', params: { msg: error } });
      }
    },

    createChartPersentasePertahun() {
      try {
        const bulanAngka = this.dataPersentase.map((item) => item.bulan);
        const persentaseData = this.dataPersentase.map((item) => item.persentase);

        // Objek yang berisi pasangan angka dan nama bulan
        const bulanMap = {
          1: 'Jan',
          2: 'Feb',
          3: 'Mar',
          4: 'Apr',
          5: 'Mei',
          6: 'Jun',
          7: 'Jul',
          8: 'Agu',
          9: 'Sep',
          10: 'Okt',
          11: 'Nov',
          12: 'Des',
        };

        // Mengganti angka bulan dengan nama bulan
        const bulan = bulanAngka.map((angka) => bulanMap[angka]);

        new Chart(this.$refs.myChart, {
          type: 'bar',
          data: {
            labels: bulan,
            datasets: [
              {
                label: 'Persentase kehadiran Tahun 2023',
                data: persentaseData,
                borderWidth: 1,
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'],
                borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
              },
            ],
          },
          options: {
            scales: {
              y: {
                max: 100,
                beginAtZero: true,
                ticks: {
                  stepSize: 10,
                  callback: function (value) {
                    return value + '%';
                  },
                },
              },
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    },

    async persentaseHariIni() {
      try {
        const response = await axios.get(`https://tired-erin-pantsuit.cyclic.cloud/persentase_hari_ini`);
        this.statusPresensiHariIni = response.data.data;
        console.log(this.statusPresensiHariIni);
        this.createChartPersentaseHariIni();
      } catch (error) {
        // router.push({ name: 'Eror', params: { msg: error } });
        console.log(error.response);
      }
    },

    createChartPersentaseHariIni() {
      // Menghitung total hadir dan tidak hadir
      const totalHadir = this.statusPresensiHariIni.hadir;
      const totalTidak = this.statusPresensiHariIni.tidak;
      const totalSemua = totalHadir + totalTidak;
      // Menghitung persentase hadir dan tidak hadir
      const persentaseHadir = (totalHadir / totalSemua) * 100;
      const persentaseTidak = (totalTidak / totalSemua) * 100;

      // Memutarbulatkan persentase ke angka bulat terdekat
      const bulatkanHadir = Math.round(persentaseHadir);
      const bulatkanTidak = Math.round(persentaseTidak);

      new Chart(this.$refs.persentaseHariIni, {
        type: 'doughnut',
        data: {
          labels: ['Hadir', 'Tidak Hadir'],
          datasets: [
            {
              label: 'Total',
              data: [bulatkanHadir, bulatkanTidak],
              backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.parsed;
                  return ' ' + value.toFixed(0) + ' %'; // Menambahkan "%" di belakang angka
                },
              },
            },
          },
        },
      });
    },
  },

  mounted() {
    this.persentaseHariIni();
    this.getPersentasePertahun();
  },
};
</script>
