<template>
  <div>
    <h3>Status: {{status}}</h3>
    <q-btn v-if="status === 'livre'" @click="ocupar">OCUPAR</q-btn>
    <q-btn v-if="status !== 'livre'" @click="desocupar">DESOCUPAR</q-btn>
    <q-btn @click="mostraDialogAgendar = true">AGENDAR</q-btn>
    <h3>Agenda</h3>
    <q-list>
      <q-item v-for="item in agenda" :key="item.key">
        <q-item-section>
          <q-item-label>{{item.nome}}</q-item-label>
          <q-item-label caption>{{item.horario}} </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="delete" flat round color="negative" @click="excluirItemAgenda(item.key)"></q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="mostraDialogAgendar" persistent transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section>
          <div class="text-h6">Agendar</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="itemAgenda.nome" label="Nome"/>
          <q-time v-model="itemAgenda.horario" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn @click="mostraDialogAgendar = false">CANCELAR</q-btn>
          <q-btn @click="agendar">OK</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/database'

export default {
  name: 'PageIndex',
  data () {
    return {
      status: '',
      agenda: [],
      itemAgenda: {nome: "", horario: null},
      mostraDialogAgendar: false
    }
  },
  mounted () {
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
    firebase.database().ref('agenda').on('value', snapshot => {
      this.atualizaAgenda(snapshot)
    })
  },
  methods: {
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
    },
    ocupar () {
      this.$q.dialog({
        title: 'Ocupar',
        message: 'Nome de quem vai ocupar',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (this.status === 'livre') {
          firebase.database().ref('status').set('ocupado por ' + data)
        } else {
          this.$q.dialog({
            title: 'Erro',
            message: 'Não foi possível ocupar pois já está ocupada por outra pessoa'
          })
        }
      })
    },
    desocupar () {
      firebase.database().ref('status').set('livre')
    },
    excluirItemAgenda (key) {
      firebase.database().ref('agenda/' + key).remove()
    },
    agendar () {
      let key = firebase.database().ref().child('agenda').push().key
      firebase.database().ref('agenda/' + key).set(this.itemAgenda)
      this.mostraDialogAgendar = false
    }
  }
}
</script>
