//CORE
app = {

    //CRIACAO DE NOTIFICACOES
    createNotification(id, title, message, button) {

        //FUNCTION PARA CRIACAO DE NOTIFICACOES
        chrome.notifications.create(
            id, {
                type        : "basic",
                iconUrl     : chrome.runtime.getURL("/assets/icons/48.png"),
                title       : title,
                message     : message,
                priority    : 1,
                buttons     : [{
                    title: button
                }]
            },
            function (idnotification) {
                // console.log(idnotification);
                // console.log(chrome.runtime.lastError);
            }
        );

    },

    //CAPTURANDO DADOS DE UM ALARME
    getAlarm(id){

        //LISTANDO DADOS DE UM ALARME ESPECIFICO
        chrome.alarms.get(id, function(alarm){
            console.log(alarm);
        });

    },

    //CAPTURA TODOS OS ALARMES
    getAllAlarms() {

        //LISTANDO TODOS OS ALARMES
        chrome.alarms.getAll(function (alarms) {
            alarms.some(function (alarm) {
                console.log(alarm)
            });
        });

    },

    //TRANSMITINDO ALARMES DO STORAGE PARA ALARMES REGISTRADOS
    getAlarmsStorageCreateNotifications(){

        //LIMPANDO ALARMS ATUAIS
        app.clearAllAlarms();

        //LISTANDO ALARMS SALVOS NO STORAGE
        chrome.storage.sync.get(["alarms"], function(data) {
            
            //INTERATOR OS ALARMES DO STORAGE
            $(data.alarms).each(function(indice, alarm){
                //REGISTRANDO ALARME
                chrome.alarms.create(alarm.notification.toString(), {
                    when            : (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), alarm.houres, alarm.minutes).getTime()),
                    periodInMinutes : 1440
                });

            });

        });

    },

    //CRIAR ALARME
    createAlarm(id) {

        //CRIANDO UM ALARME
        chrome.alarms.create(id, {
            //TIMESTAMP EM MILISEGUNDOS DA DATA DE ACIONAMENTO DO ALARME
            when: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 20, 11).getTime(),
            //MINUTOS DE ESPERA APOS A CRIAÇÃO ATÉ QUE O ALARME SEJA EXECUTADO
            // delayInMinutes: 1,
            //INTERVALO EM MINUTOS ATÉ QUE O ALARME SEJA EXECUTADO NOVAMENTE (1440 PARA INTERVALO DE UM DIA)
            periodInMinutes: 1440
        });

    },

    //EXCLUIR ALARME
    clearAlarm(id) {

        //EXECLUINDO UM ALARME ESPECIFICO
        chrome.alarms.clear(id);

    },

    //EXCLUIR TODOS OS ALARMES
    clearAllAlarms() {

        //EXCLUIR TODOS OS ALARMES
        chrome.alarms.getAll(function (alarms) {
            alarms.some(function (alarm) {
                chrome.alarms.clear(alarm.name);
            });
        });

    },

}

//CHAMADA INICIAL
document.addEventListener("DOMContentLoaded", function () {
    
    //CARREGANDO ALARMS DO STOGAGE
    app.getAlarmsStorageCreateNotifications();

    //LISTANDO ALARMS REGISTRADOS NO CONSOLER
    app.getAllAlarms();

    //ESCUTAR EVENTOS DE ALARME DISPARADOS
    chrome.alarms.onAlarm.addListener(function(alarmevet){
        
        //VERIFICANDO SE O ALARME E UM DESSES
        chrome.storage.sync.get(["alarms"], function(data) {
            
            //INTERATOR OS ALARMES DO STORAGE
            $(data.alarms).each(function(indice, alarm){

                if(Number(alarmevet.name) === Number(alarm.notification)){

                    //VERIFICANDO SE E O MOMENTO DE DISPARAR O ALARME
                    if((new Date().getHours() == alarm.houres) && (new Date().getMinutes() == alarm.minutes)){
                        
                        //CRIANDO NOTIFICACOES
                        app.createNotification(
                            alarm.notification.toString(),
                            alarm.title.toString(),
                            alarm.description.toString(),
                            "Beleza, Obrigado !"
                        );
                    }

                }

            });

        });
        
    });
    
    //EXECUTAR ACOES EM BUTTONS DE NOTIFICACOES
    chrome.notifications.onButtonClicked.addListener(function(notification, button) {
        
        //LISTANDO NOTIFICACOES
        chrome.notifications.getAll(function(notifications){

            //PESQUISANDO NOTIFICACAO
            if(notifications[notification]){

                //NOTIFICACAO IDENTIFICADA - ELIMINANDO NOTIFICACAO
                chrome.notifications.clear(notification);

            }

        });
    });

});
