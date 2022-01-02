//OPTIONS
options = {

    //ADICIONAR UM NOVO ALARME
    setObjectAlarm(object){

        //LISTA OBJETOS SALVOS
        chrome.storage.sync.get(["alarms"], function(data) {
            //VERIFICANDO SE HA OBJECTOS SALVOS
            if(data.alarms){
                //ADICIONANDO OBJECTO A OBJECTOS JÀ SALVOS
                data.alarms.push(object);
                //INSERINDO OBJECTO FINAL CONSOLIDADO
                chrome.storage.sync.set(data, function() {
                    //RESPOSTA SE A INSERCAO FOI FEITO COM SUCESSO
                    return !Boolean(chrome.runtime.lastError);
                });
            } else {
                //INSERINDO O PRIMEIRO OBJECTO
                chrome.storage.sync.set({"alarms": [object]}, function() {
                    //RESPOSTA SE A INSERCAO FOI FEITO COM SUCESSO
                    return !Boolean(chrome.runtime.lastError);
                });
            }
        });

    },

    //LISTA UM NOTIFICACAO ESPECIFICA
    getObjectAlarm(notification){

        //LISTANDO O ALARME PESQUISADO
        chrome.storage.sync.get(["alarms"], function(data) {
            $(data.alarms).each(function(indice, alarm){
                if(alarm.notification == notification){
                    console.log(alarm);
                }
            });
        });

    },

    //LISTAR TODOS OS ALARMES
    getObjectsAlarm(){

        //LISTANDO ALARMS SALVOS NO STORAGE
        chrome.storage.sync.get(["alarms"], function(data) {
            console.log(data);
        });

    },

    //LIMPAR TODO O STORAGE
    cleanObjects(){

        //CLER O STORAGE DA EXTENSAO
        chrome.storage.sync.clear(function() {
            console.log("Storege Clean !");
        });

    },

    //LIMPAR CAMPOS DO FORMULARIO
    cleanFields(){

        //LIMPANDO CAMPOS DO FORMULARIO
        $("#title").val("");
        $("#description").val("");
        $("#houres").val("");
        $("#minutes").val("");

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

        //EXCLUIR TODOS OS ALARMES
        chrome.alarms.getAll(function (alarms) {

            //EXCLUIR CADA ALARM JA CRIADO
            alarms.some(function (alarm) {
                chrome.alarms.clear(alarm.name);
            });

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

                //RELOAD NA PAGINA
                location.reload();
    
            });

        });

    },

    //SALVAR NOVO ALARME
    saveAlarm(){

        //CAPTURE DATA
        let title           = $("#title").val();
        let description     = $("#description").val();
        let houres          = $("#houres").val();
        let minutes         = $("#minutes").val();
        let notification    = new Date().getTime();

        //VERIFICANDO DADOS
        if(title && description && houres && minutes && notification){

            //DETERINANDO FORMATO DO OBJECT
            let object = {
                "notification"  : notification,
                "title"         : title,
                "description"   : description,
                "houres"        : houres,
                "minutes"       : minutes
            };
            
            //SAVE OBJECT
            options.setObjectAlarm(object);
            
            //CLEAN FIELDS FORM DE CRIACAO
            options.cleanFields();

            //RELOAD ALARMS
            options.getAlarmsStorageCreateNotifications();

        }

    },

    //LISTA ALARMS CRIADOS
    listAlarmsOptions(){

        //SELECT ALARMS
        chrome.storage.sync.get(["alarms"], function(data) {
            
            //CLEAR DIV
            document.getElementById("listalarms").innerHTML = "";

            //ITERATION OBJECTS
            $(data.alarms).each(function(indice, alarm){

                //ADD ELEMENTS VIEW
                document.getElementById("listalarms").innerHTML += `    
                    <tr>
                        <td class="col-md-80 flex-container ${ indice == 0 ? "fist" : "" }">
                            <p class="text-alarm">${alarm.title}</p>
                            <small class="text-description">${alarm.description}</small>
                        </td>
                        <td class="col-md-10 flex-container ${ indice == 0 ? "fist" : "" }">${alarm.houres}:${alarm.minutes}</td>
                        <td class="col-md-10 flex-container ${ indice == 0 ? "fist" : "" }">
                            <button type="button" id="${alarm.notification}" class="glyphicon glyphicon-trash btn btn-exclude btn-danger btn-xs"></button>
                        </td>
                    </tr>
                `;

            });

            //GET FOR BIND EVENTS
            let btns = document.getElementsByClassName("btn-exclude");

            //BIND FUNCTION EVENT EXCLUSION
            for(i = 0; i < btns.length; i++){
                document.getElementById(btns[i].id).addEventListener("click", function(e){
                    
                    //INIT NEW OBJECT
                    objects = [];

                    //GET OBJECTS SAVES
                    chrome.storage.sync.get(["alarms"], function(data) {

                        //CRIANDO ARRAY COM OBJETOS RESTANTES
                        $(data.alarms).each(function(indice, alarm){
                            if(alarm.notification != e.target.id){
                                objects.push(alarm);         
                            }
                        });

                        //LIMPANDO O STORAGE
                        chrome.storage.sync.clear();

                        //SALVANDO LISTA DE ALARMS RESTANTES
                        chrome.storage.sync.set({"alarms": objects}, function() {
                            location.reload();
                        });

                    });
                });
            };

        });

    },

}

//ONLOAD INICIAL
document.addEventListener("DOMContentLoaded", function () {
    
    //LISTAR ALARMS SALVOS
    options.listAlarmsOptions();

    //SAVE ALARMS
    $("#save").bind("click", function(){
        options.saveAlarm(); 
    });

});