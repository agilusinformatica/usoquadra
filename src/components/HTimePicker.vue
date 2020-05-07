<template>
    <div>
        <div class="row text-center text-grey-7 cursor-pointer">
            <div class="col-6">
                <q-scroll-area style="height: 170px;">
                    <div v-for="hora in horas" :key="hora" class="text-h6 q-mb-sm border-invisible" :style="horaAtual === hora ? 'color: #000; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0' : ''" @click="setHora(hora)">{{hora}}</div>
                </q-scroll-area>
            </div>
            <div class="col-6">
                <q-scroll-area style="height: 170px;">
                    <div v-for="minuto in minutos" :key="minuto" class="text-h6 q-mb-sm border-invisible" :style="minutoAtual == minuto ? 'color: #000; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0' : ''" @click="setMinuto(minuto)">{{minuto}}</div>
                </q-scroll-area>
            </div>
        </div>
    </div>
</template>
<script>
import utils from 'src/lib/utils'
export default {
    props: ['value'],
    data () {
        return {
            horaAtual: utils.horaAtual().toString().padStart(2, '0'),
            minutoAtual: utils.minutoAtualBase5().toString().padStart(2, '0')
        }
    },
    computed: {
        horas () {
            let hours = []
            for (let i = utils.horaAtual(); i <= 22; i++) {
                hours.push(i.toString().padStart(2, '0'))
            }
            return hours
        },
        minutos () {
            let mins = []
            for (let i = 0; i < 60; i += 5) {
                mins.push(i.toString().padStart(2, '0'))
            }
            return mins
        }
    },
    methods: {
        setHora (h) {
            this.horaAtual = h
            this.$emit('input', this.horaAtual + ":" + this.minutoAtual)
        },
        setMinuto (m) {
            this.minutoAtual = m
            this.$emit('input', this.horaAtual + ":" + this.minutoAtual)
        }
    }
}
</script>
<style lang="stylus">
.border-invisible 
    border 1px solid #fff
</style>