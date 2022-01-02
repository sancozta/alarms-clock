//POPUP
popup = {

     //LISTA ALARMS CRIADOS
     listAlarmsPopUp(){

        //SELECT ALARMS 
        chrome.storage.sync.get(["alarms"], function(data) {
            
            //CLEAR DIV
            document.getElementById("listalarms").innerHTML = "";
            console.log(data.alarms);
            //ITERATION OBJECTS
            $(data.alarms).each(function(indice, alarm){

                //ADD ELEMENTS VIEW
                document.getElementById("listalarms").innerHTML += `    
                    <tr>
                        <td class="col-md-90 text-resume ${ indice == 0 ? "fist" : "" }"><i class="glyphicon glyphicon-dashboard"></i>  ${alarm.title}</td>
                        <td class="col-md-10 ${ indice == 0 ? "fist" : "" }"><span class="badge">${alarm.houres}:${alarm.minutes}</span></td>
                    </tr>
                `;

            });

        });
    },

}

//CHAMADA INICIAL
document.addEventListener("DOMContentLoaded", function () {
    
    //LISTA ALARMS
    popup.listAlarmsPopUp();

})

