export default {
    setCookie (name, value, days) {
        var date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        var expires = '; expires=' + date.toGMTString()
        document.cookie = name + '=' + value + expires + '; path=/'
    },
    getCookie (name) {
        var cArr = document.cookie.split(';')
        for (var i = 0; i < cArr.length; i++) {
            var cookie = cArr[i].split('=', 2)
            cookie[0] = cookie[0].replace(/^\s+/, '')
            if (cookie[0] === name) { return cookie[1] }
        }
    },
    deleteCookie (name) {
        this.setCookie(name, '', -1)
    },
    horaAtual () {
        let hora = new Date().getHours()
        let minuto = new Date().getMinutes()
        return minuto > 55 ? hora + 1 : hora
    },
    minutoAtualBase5 () {
        let minuto = new Date().getMinutes()
        return (minuto + (5 - (minuto % 5))) % 60
    },
}