<template>
  <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
          <div class="d-flex justify-content-center py-4">
            <a href="" class="logo d-flex align-items-center w-auto">
              <img src="#" alt="" />
              <span class="d-none d-lg-block">Sinar Tanjung Group</span>
            </a>
          </div>
          <!-- End Logo -->

          <div class="card mb-3">
            <div class="card-body">
              <div class="pt-4 pb-2">
                <h5 class="card-title text-center pb-0 fs-4">Login</h5>
                <p class="text-center small">Enter your username & password to login</p>
              </div>
              <form @submit.prevent="login" class="row g-3 needs-validation" novalidate>
                <div class="col-12">
                  <label for="yourUsername" class="form-label">Email</label>
                  <div class="input-group has-validation">
                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                    <input v-model="email" type="email" name="email" class="form-control" id="yourEmail" required />
                    <div class="invalid-feedback">Please enter your email.</div>
                  </div>
                  <div class="text-danger fst-italic">{{ eml }}</div>
                </div>

                <div class="col-12">
                  <label for="yourPassword" class="form-label">Password</label>
                  <input v-model="password" type="password" name="password" class="form-control" id="yourPassword" required />
                  <div class="invalid-feedback">Please enter your password!</div>
                  <div class="text-danger fst-italic">{{ pswd }}</div>
                </div>

                <div class="col-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                    <label class="form-check-label" for="rememberMe">Remember me</label>
                  </div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary w-100" type="submit">Login</button>
                </div>
              </form>
            </div>
          </div>

          <div class="credits">Designed by <a href="#">STG V.00.01</a></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import router from '@/router';

export default {
  data() {
    return {
      email: '',
      password: '',
      eml: '',
      pswd: '',
    };
  },

  methods: {
    async login() {
      try {
        const response = await axios.post(`https://tired-erin-pantsuit.cyclic.cloud/login`, {
          email: this.email,
          password: this.password,
        });

        if (response.data) {
          if (response.data.data) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('shift', true);
            Swal.fire({
              title: 'Sukses!',
              text: response.data.msg,
              icon: 'success',
            });
            router.push('/dashboard');
          } else if (response.data.eml) {
            this.eml = response.data.eml;
            this.pswd = '';
          } else {
            this.eml = '';
            this.pswd = response.data.pswd;
          }
        }
      } catch (error) {
        // router.push({ name: 'Eror', params: { msg: error } });
        console.log(error.response);
      }
    },
  },

  mounted() {
    const token = localStorage.getItem('accessToken');
    if (token) router.push('/dashboard');
  },
};
</script>
