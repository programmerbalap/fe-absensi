<template>
  <div class="modal fade" id="modal-upload-file" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Unggah Document</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row mb-3 px-2 d-flex flex-col">
            <div class="col text-start">
              <label for="fotoid" class="mb-2">File Foto**</label>
              <input class="form-control" type="file" id="fotoid" ref="foto" />
            </div>
            <div class="col-2 d-flex align-items-end p-1">
              <button type="button" class="btn btn-primary btn-sm" @click="uploadFile(dataDoc.id, 'foto')">Simpan</button>
            </div>
          </div>
          <p class="text-start mx-3 fst-italic text-success" style="margin-top: -12px">{{ dataDoc.foto }}</p>
          <div class="row mb-3 px-2 d-flex flex-col">
            <div class="col text-start">
              <label for="kkid" class="mb-2">File KK**</label>
              <input class="form-control" type="file" id="kkid" ref="kk" />
            </div>
            <div class="col-2 d-flex align-items-end p-1">
              <button type="button" class="btn btn-primary btn-sm" @click="uploadFile(dataDoc.id, 'kk')">Simpan</button>
            </div>
          </div>
          <p class="text-start mx-3 fst-italic text-success" style="margin-top: -12px">{{ dataDoc.kk }}</p>
          <div class="row mb-3 px-2 d-flex flex-col">
            <div class="col text-start">
              <label for="ktpid" class="mb-2">File KTP**</label>
              <input class="form-control" type="file" id="ktpid" ref="ktp" />
            </div>
            <div class="col-2 d-flex align-items-end p-1">
              <button type="button" class="btn btn-primary btn-sm" @click="uploadFile(dataDoc.id, 'ktp')">Simpan</button>
            </div>
          </div>
          <p class="text-start mx-3 fst-italic text-success" style="margin-top: -12px">{{ dataDoc.ktp }}</p>
          <div class="row mb-3 px-2 d-flex flex-col">
            <div class="col text-start">
              <label for="ijazahid" class="mb-2">File Ijazah**</label>
              <div class="position-relative">
                <input class="form-control" type="file" id="ijazahid" ref="ijazah" />
              </div>
            </div>
            <div class="col-2 d-flex align-items-end p-1">
              <button type="button" class="btn btn-primary btn-sm" @click="uploadFile(dataDoc.id, 'ijazah')">Simpan</button>
            </div>
          </div>
          <p class="text-start mx-3 fst-italic text-success" style="margin-top: -12px">{{ dataDoc.ijazah }}</p>
        </div>
      </div>
    </div>
  </div>
  <!-- End Basic Modal-->
</template>

<script>
import axios from 'axios';
import SweetAlertHelper from '@/SweetAlertHelper/SweetAlertHelper';
// import router from '@/router';
import { API_KEY } from '../../../env';

export default {
  props: {
    dataDoc: {
      type: Object,
      required: true,
    },
  },

  methods: {
    refresKaryawan() {
      // Emit custom event untuk memanggil fungsi di komponen orang tua
      this.$emit('get-data-karyawan');
    },

    async uploadFile(id, nama) {
      const formData = new FormData();
      formData.append('file', this.$refs[nama].files[0]);
      await axios
        .patch(`${API_KEY}document_?id_doc=${id}&file_name=${nama}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          SweetAlertHelper.success('Berhasil!', response.data.msg);
          this.$refs[nama].value = null;
          this.dataDoc;
          this.refresKaryawan();
        })
        .catch((error) => {
          if (error) {
            // router.push({ name: 'Eror', params: { msg: error } });
            console.log(error.response);
          }
        });
    },
  },
};
</script>
