<template>
  <div class="q-ma-lg row justify-center">
    <div class="col-xs-12 col-sm-9 col-md-6 col-lg-4 col-xl-3">
      <div class="text-h3 text-center q-mb-lg text-weight-light">Uso da quadra</div>
      <div class="row items-center bg-white shadow-16 q-pa-md border">
        <div class="col-8">
          <div class="text-caption">Status</div>
          <div class="text-h4 text-weight-light text-capitalize">
            {{status}}
            <q-icon v-if="status" name="fiber_manual_record" :color="status === 'livre' ? 'positive' : 'negative'" size="18px"/>
          </div>
        </div>
        <div class="col-4 text-right">
          <q-btn v-if="status === 'livre'" @click="abrirOcupacao" color="primary" label="Ocupar" :size="tamanhoCustom()" rounded/>
          <q-btn v-if="status !== 'livre'" @click="desocupar" color="primary" label="Desocupar" :size="tamanhoCustom()" rounded/>
        </div>
        <div class="text-h6 col-12 text-weight-light" v-if="horarioDesocupacao && status !== 'livre'">
          Pretende desocupar às {{horarioDesocupacao}}
        </div>
      </div>

      <div class="q-mt-lg bg-white shadow-16 q-pa-md border">
        <div class="row justify-between q-mb-md">
          <div class="text-h4 text-weight-light">Agenda</div>
          <q-btn @click="abrirAgendamento" color="primary" label="Agendar" icon="event" :size="tamanhoCustom()" rounded />
        </div>

        <q-list padding>
          <q-item v-for="item in agenda" :key="item.key">
            <q-item-section>
              <q-item-label class="text-weight-bold">{{item.nome}}</q-item-label>
              <q-item-label caption>{{item.horario}} </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn icon="o_delete" size="14px" flat round color="negative" @click="excluirItemAgenda(item.key)">
                <q-tooltip>remover</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

    </div>

    <q-dialog v-model="mostraDialogAgendar" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 360px; border-radius: 16px;">

        <q-card-section>
          <div class="text-h6">Agendar</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="itemAgenda.nome" label="Seu Nome" filled :error="erroNome" @input="erroNome = false"/>
          <div class="row items-center justify-between">
            <div class="col-12">Horário para agendar</div>
            <div class="text-h5">{{itemAgenda.horario}}</div>
          </div>
          <h-time-picker v-model="itemAgenda.horario" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn @click="mostraDialogAgendar = false" flat rounded label="cancelar" color="primary" />
          <q-btn @click="agendar" label="Ok" rounded color="primary"/>
        </q-card-actions>

      </q-card>
    </q-dialog>
    <q-dialog v-model="mostraDialogOcupar" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 360px; border-radius: 16px;">

        <q-card-section>
          <div class="text-h6">Ocupar</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="nomeOcupacao" label="Seu Nome" filled :error="erroNome" @input="erroNome = false"/>
          <div class="row items-center justify-between">
            <div class="col-12">Horário que pretende desocupar</div>
            <div class="text-h5">{{horarioDesocupacao}}</div>
          </div>
          <h-time-picker v-model="horarioDesocupacao" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn @click="mostraDialogOcupar = false" flat rounded label="cancelar" color="primary" />
          <q-btn @click="ocupar" label="Ok" rounded color="primary"/>
        </q-card-actions>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/database'
import utils from 'src/lib/utils'
import HTimePicker from 'src/components/HTimePicker'

export default {
  name: 'PageIndex',
  components: {HTimePicker},
  data () {
    return {
      status: '',
      agenda: [],
      itemAgenda: {nome: "", horario: utils.horaAtual().toString().padStart(2, '0') + ":" + utils.minutoAtualBase5().toString().padStart(2, '0')},
      mostraDialogAgendar: false,
      mostraDialogOcupar: false,
      erroNome: false,
      horarioDesocupacao: '',
      nomeOcupacao: ''
    }
  },
  created () {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyABZfEzRIS7dZp_9H8GFkokMiStEn_xq6U",
      authDomain: "usoquadra.firebaseapp.com",
      databaseURL: "https://usoquadra.firebaseio.com",
      projectId: "usoquadra",
      storageBucket: "usoquadra.appspot.com",
      messagingSenderId: "167185962232",
      appId: "1:167185962232:web:8c64fa596a9b1b2acf170d"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    firebase.database().ref('status').on('value', snapshot => {
      this.atualizaStatus(snapshot)
    })
    firebase.database().ref('horarioDesocupacao').on('value', snapshot => {
      this.atualizaHorarioDesocupacao(snapshot)
    })
    firebase.database().ref('agenda').on('value', snapshot => {
      this.atualizaAgenda(snapshot)
    })
  },
  methods: {
    tamanhoCustom () {
      return this.$q.screen.width < 380 ? '12px' : ''
    },
    atualizaHorarioDesocupacao(snapshot) {
      this.horarioDesocupacao = snapshot.val()
    },
    atualizaStatus(snapshot) {
      this.status = snapshot.val()
    },
    atualizaAgenda(snapshot) {
      this.agenda = []
      let valores = snapshot.val()
      for (let prop in valores) {
        this.agenda.push({
          key: prop,
          nome: valores[prop].nome,
          horario: valores[prop].horario
        })
      }
      this.agenda.sort((a,b) => {
        if (a.horario > b.horario) {
          return 1;
        }
        if (b.horario > a.horario) {
          return -1;
        }
        return 0;
      })
    },
    nomeUsuario () {
      return utils.getCookie('nomeUsuario')
    },
    ocupar () {
      if (this.nomeOcupacao) {
        utils.setCookie('nomeUsuario', this.nomeOcupacao, 365)
        firebase.database().ref('status').set('ocupado por ' + this.nomeOcupacao)
        firebase.database().ref('horarioDesocupacao').set(this.horarioDesocupacao)
        this.mostraDialogOcupar = false
      }
      else {
        this.erroNome = true
      }
    },
    desocupar () {
      firebase.database().ref('status').set('livre')
      firebase.database().ref('horarioDesocupacao').set('')
    },
    excluirItemAgenda (key) {
      firebase.database().ref('agenda/' + key).remove()
    },
    abrirAgendamento () {
      this.itemAgenda.horario = utils.horaAtual().toString().padStart(2, '0') + ":" + utils.minutoAtualBase5().toString().padStart(2, '0')
      this.itemAgenda.nome = this.nomeUsuario()
      this.mostraDialogAgendar = true
    },
    abrirOcupacao () {
      this.horarioDesocupacao = utils.horaAtual().toString().padStart(2, '0') + ":" + utils.minutoAtualBase5().toString().padStart(2, '0')
      this.nomeOcupacao = this.nomeUsuario()
      this.mostraDialogOcupar = true
    },
    agendar () {
      if (this.itemAgenda.nome) {
        utils.setCookie('nomeUsuario', this.itemAgenda.nome, 1)
        let key = firebase.database().ref().child('agenda').push().key
        firebase.database().ref('agenda/' + key).set(this.itemAgenda)
        this.mostraDialogAgendar = false
      }
      else {
        this.erroNome = true
      }
    }
  }
}
</script>
<style>
body {
  background-color: #eee;
}

.border {
  border-radius: 16px;
}
</style>
