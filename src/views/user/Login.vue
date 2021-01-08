<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <p class="text-white h2">
            Facilitando a conexão entre pacientes, médicos e instituições de
            saúde com a tecnologia da telemedicina.
          </p>
        </div>
        <div class="form-side">
          <router-link tag="a" to="/">
            <logo-conexa class="mb-3" />
          </router-link>
          <h6 class="mb-4">Login</h6>

          <b-form
            @submit.prevent="formSubmit"
            class="av-tooltip tooltip-label-bottom"
          >
            <b-form-group label="E-mail" class="has-float-label mb-4">
              <b-form-input
                type="text"
                v-model="$v.form.email.$model"
                :state="!$v.form.email.$error"
              />
              <b-form-invalid-feedback v-if="!$v.form.email.required"
                >E-mail é obrigatório!</b-form-invalid-feedback
              >
              <b-form-invalid-feedback v-else-if="!$v.form.email.email"
                >E-mail inválido!</b-form-invalid-feedback
              >
            </b-form-group>

            <b-form-group label="Senha" class="has-float-label mb-4">
              <b-form-input
                type="password"
                v-model="$v.form.password.$model"
                :state="!$v.form.password.$error"
              />
              <b-form-invalid-feedback v-if="!$v.form.password.required"
                >Senha é obrigatória!</b-form-invalid-feedback
              >
            </b-form-group>
            <div class="d-flex justify-content-between align-items-center">
              <b-button
                type="submit"
                variant="primary"
                size="lg"
                :disabled="processing"
                :class="{
                  'btn-multiple-state btn-shadow': true,
                  'show-spinner': processing,
                  'show-success': !processing && loginError === false,
                  'show-fail': !processing && loginError,
                }"
              >
                <span class="spinner d-inline-block">
                  <span class="bounce1"></span>
                  <span class="bounce2"></span>
                  <span class="bounce3"></span>
                </span>
                <span class="icon success">
                  <i class="simple-icon-check"></i>
                </span>
                <span class="icon fail">
                  <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">LOGIN</span>
              </b-button>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { LogoConexa } from "../../components/Svg";

const {
  required,
  maxLength,
  minLength,
  email,
} = require("vuelidate/lib/validators");
import { adminRoot } from "../../constants/config";

export default {
  data() {
    return {
      form: {
        email: "igor.silva@conexasaude.com.br",
        password: "12345678",
      },
    };
  },
  components: {
    LogoConexa,
  },
  mixins: [validationMixin],
  validations: {
    form: {
      password: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(4),
      },
      email: {
        required,
        email,
        minLength: minLength(4),
      },
    },
  },
  computed: {
    ...mapGetters(["currentUser", "processing", "loginError"]),
  },
  methods: {
    ...mapActions(["login"]),
    formSubmit() {
      this.$v.form.$touch();
      if (!this.$v.form.$anyError) {
        this.login({
          email: this.form.email,
          senha: this.form.password,
        });
      }
    },
  },
  watch: {
    currentUser(val) {
      if (val && val.token.length > 0) {
        setTimeout(() => {
          this.$router.push("/");
        }, 200);
      }
    },
    loginError(val) {
      if (val != null) {
        this.$notify("error", "Login Error", val, {
          duration: 3000,
          permanent: false,
        });
      }
    },
  },
};
</script>
