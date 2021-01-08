<template>
  <app-layout>
    <div class="container">
      <!-- Titulo -->
      <div class="row">
        <div class="col">
          <h1>Lista de pacientes agendados</h1>
        </div>
        <div class="col">
          <button
            @click="aux.isShowModalPaciente = true"
            type="button"
            class="btn default btn-outline-primary float-right"
          >
            +NOVO AGENDAMENTO
          </button>
        </div>
      </div>

      <!-- infoGrid -->
      <div class="row border-bottom">
        <div class="col">
          <b>{{ pacientesRest.length }}</b> Agendamentos
        </div>
      </div>

      <!-- lista de agendamentos -->
      <div class="row">
        <div class="col">
          <div class="mes mt-4 d-flex flex-column align-items-start">
            <template v-for="(anoMes, index) in aux.pacientes">
              <b-button v-b-toggle="'accordion-' + index" variant="link">
                <span>{{ aux.nomesMeses[anoMes.mes] }}</span>
                <span>/{{ anoMes.ano }}</span>
              </b-button>

              <b-collapse :id="'accordion-' + index" accordion="my-accordion">
                <div class="dia" v-for="dia in anoMes.dias">
                  <span>Dia {{ dia.dia }}</span>
                  <div
                    class="paciente"
                    v-for="paciente in dia.pacientes"
                    @click="detalhesDoPaciente(paciente.id)"
                  >
                    <span>{{ paciente.paciente }}</span>
                    <span>{{ paciente.dataConsulta | moment("h:mm a") }}</span>
                  </div>
                </div>
              </b-collapse>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Novo agendamento -->
    <b-modal v-model="aux.isShowModalPaciente" :title="'Novo Agendamento'">
      <b-row>
        <b-colxx xxs="12">
          <b-form @submit.prevent="criarAgendamento">
            <b-form-group :label="'Paciente'">
              <b-form-input
                type="text"
                v-model="model.novoAgendamento.paciente"
              />
              <span
                v-if="
                  !$v.model.novoAgendamento.paciente.required &&
                  $v.model.novoAgendamento.paciente.$error
                "
                >Paciente é obrigatório!</span
              >
            </b-form-group>

            <b-form-group :label="'Data/Hora'">
              <datetime
                class="form-control"
                type="datetime"
                v-model="model.novoAgendamento.dataConsulta"
              ></datetime>
              <span
                v-if="
                  !$v.model.novoAgendamento.dataConsulta.required &&
                  $v.model.novoAgendamento.dataConsulta.$error
                "
                >Data/Hora é obrigatório!</span
              >
            </b-form-group>

            <b-form-group :label="'Observações'">
              <b-form-textarea
                type="text"
                v-model="model.novoAgendamento.observacao"
              />
            </b-form-group>
          </b-form>
        </b-colxx>
      </b-row>
      <template slot="modal-footer">
        <b-button variant="primary" @click="criarAgendamento()" class="mr-1"
          >Cadastrar</b-button
        >
        <b-button variant="secondary" @click="cancelar()">Cancelar</b-button>
      </template>
    </b-modal>

    <!-- Modal detalhes do paciente -->
    <b-modal
      v-model="aux.isShowModalDetalhesPaciente"
      :title="'Detalhes do agendamento'"
    >
      <span v-if="aux.paciente.observacao">
        {{ aux.paciente.observacao }}
      </span>

      <template slot="modal-footer">
        <b-button
          variant="primary"
          @click="aux.isShowModalDetalhesPaciente = false"
          >Fechar</b-button
        >
      </template>
    </b-modal>
  </app-layout>
</template>

<script>
import { filter } from "vuedraggable";
import AppLayout from "../../layouts/AppLayout";
import axios from "axios";
import "vue-datetime/dist/vue-datetime.css";
import { mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");

import { Datetime } from "vue-datetime";

export default {
  components: {
    AppLayout,
    Datetime,
  },

  data() {
    return {
      model: {
        novoAgendamento: {
          idMedico: 1,
          paciente: "",
          dataConsulta: "",
          observacao: "",
        },
      },
      aux: {
        anoMes: [],
        dias: [],
        nomesMeses: [
          "janeiro",
          "fevereiro",
          "março",
          "abril",
          "maio",
          "junho",
          "agosto",
          "outubro",
          "novembro",
          "dezembro",
        ],
        pacientes: [],
        isShowModalPaciente: false,
        isShowModalDetalhesPaciente: false,
        paciente: {},
      },
      pacientesRest: [],
    };
  },
  created() {
    this.getPacientes();
  },
  mixins: [validationMixin],
  validations: {
    model: {
      novoAgendamento: {
        paciente: {
          required,
        },
        dataConsulta: {
          required,
        },
      },
    },
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser",
    }),
  },
  methods: {
    detalhesDoPaciente(idPaciente) {
      this.getPaciente(idPaciente);
    },
    filtrarPacientes(pAno, pMes, pDia) {
      return this.pacientesRest.filter((element) => {
        let data = new Date(element.dataConsulta);
        let ano = data.getFullYear();
        let mes = data.getMonth();
        let dia = data.getDate();

        return ano === pAno && mes === pMes && dia === pDia;
      });
    },
    agruparPorAnoMesDias() {
      var array = [];

      //Agrupar por ano/mes.
      for (let i = 0; i < this.pacientesRest.length; i++) {
        const element = this.pacientesRest[i];

        let data = new Date(this.pacientesRest[i].dataConsulta);
        let ano = data.getFullYear();
        let mes = data.getMonth();

        if (
          !array.some((item) => {
            return item["ano"] === ano && item["mes"] === mes;
          })
        ) {
          array.push({ ano: ano, mes: mes, dias: [] });
        }
      }

      //Agrupar por dia.
      this.pacientesRest.forEach((element) => {
        let data = new Date(element.dataConsulta);
        let ano = data.getFullYear();
        let mes = data.getMonth();
        let dia = data.getDate();

        let anoMes = array.find((val) => {
          return val.ano === ano && val.mes === mes;
        });

        if (anoMes) {
          if (
            !anoMes.dias.some((item) => {
              return item.dia === dia;
            })
          ) {
            anoMes.dias.push({ dia: dia, pacientes: [] });
          }
        }
      });

      //popular as data com seus respectivos pacientes.
      array.forEach((anoMes) => {
        anoMes.dias.forEach((dia) => {
          dia.pacientes = this.filtrarPacientes(
            anoMes.ano,
            anoMes.mes,
            dia.dia
          );
        });
      });

      this.aux.pacientes = array;
    },
    getPacientes() {
      var self = this;

      const options = {
        method: "get",
        url: "http://desafio.conexasaude.com.br/api/consultas",
        headers: {
          Authorization: `Bearer ${this.currentUser.token}`,
        },
      };

      axios(options).then((response) => {
        self.pacientesRest = response.data.data;
        this.agruparPorAnoMesDias();
      });
    },
    getPaciente(idPaciente) {
      var self = this;

      const options = {
        method: "get",
        url: "http://desafio.conexasaude.com.br/api/consulta/" + idPaciente,
        headers: {
          Authorization: `Bearer ${this.currentUser.token}`,
        },
      };

      axios(options).then((response) => {
        self.aux.paciente = response.data.data;
        self.aux.isShowModalDetalhesPaciente = true;
      });
    },
    cancelar() {
      this.aux.isShowModalPaciente = false;
      this.model.novoAgendamento.paciente = "";
      this.model.novoAgendamento.dataConsulta = "";
      this.model.novoAgendamento.observacao = "";
    },
    criarAgendamento() {
      var self = this;
      
      self.$v.model.novoAgendamento.$touch();

      if (self.$v.model.novoAgendamento.$anyError) {
        return;
      }

      const options = {
        method: "post",
        url: "http://desafio.conexasaude.com.br/api/consulta",
        data: self.model.novoAgendamento,
        headers: {
          Authorization: `Bearer ${this.currentUser.token}`,
        },
      };

      axios(options).then((response) => {
        self.pacientesRest.push(response.data.data);
        self.agruparPorAnoMesDias();
      });
    },
  },
};
</script>


<style lang="scss" scoped>
/deep/ .vdatetime-input {
  border: none !important;
  width: 100%;
}
.border-bottom {
  border-bottom: 1px solid #eeeeee !important;
}

.border-left {
  border-left: 1px solid #000000 !important;
}

.mes {
  button {
    text-decoration: none;
    padding-left: 0;
    padding-bottom: 0;
    text-transform: uppercase;
    span {
      font-size: 18px;
      font-weight: 400;
      font-family: "roboto";
    }
    span:nth-of-type(1) {
      color: #ef4056;
    }
  }

  .dia {
    margin-top: 15px;
    > span {
      font-size: 13px;
      font-weight: 600;
    }
    .paciente {
      cursor: pointer;
      margin-top: 8px;
      margin-left: 10px;
      display: flex;
      flex-flow: column;
      padding-left: 5px;
      border-left: 1px solid #000;
      span:nth-of-type(1) {
        font-weight: 800;
      }
      span:nth-of-type(2) {
        color: #2680eb;
        font-size: 11px;
      }
      &:hover {
        color: #2680eb;
      }
    }
  }
}
</style>
