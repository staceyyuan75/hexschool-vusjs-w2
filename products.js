import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";

createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "staceyyuan-hexschool",
      products: [],
      temp: {}
    };
  },
  methods: {
    checkAdmin() {
      // 取得 Token
      const token = this.getToken();

      // token 寫入 header
      axios.defaults.headers.common["Authorization"] = token;

      // 確認是否登入
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then(res => {
          this.getProducts();
        })
        .catch(error => {
          let isSuccess = error.data.success;
          let message = error.data.message;
          if (!isSuccess) {
            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: "btn btn-success"
              },
              buttonsStyling: false
            });
            swalWithBootstrapButtons
              .fire({
                title: "發生錯誤",
                text: message,
                icon: "warning",
                confirmButtonText: "登入",
                reverseButtons: true
              })
              .then(result => {
                if (result.isConfirmed) {
                  window.location.href = "./login.html";
                }
              });
          }
        });
    },
    getToken() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      return token;
    },
    getProducts() {
      // 取得後台產品列表
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then(res => {
          this.products = res.data.products;
        })
        .catch(error => {
          console.log(error.data);
        });
    },
    getDetails(id) {
      // 取得產品詳細資訊
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/product/${id}`)
        .then(res => {
          this.temp = res.data.product;
        })
        .catch(error => {
          console.log(error.data);
        });
    }
  },
  mounted() {
    this.checkAdmin();
  }
}).mount("#app");
