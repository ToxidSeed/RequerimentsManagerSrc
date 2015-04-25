/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Per.Store',{
   statics:{
       getDataAsJSON: function(records){
           var fields = [];
           var json = '[';
           for(var index = 0; index < records.length; index++){
               //Creando el Objeto
               json += '{';
               fields = records[index].fields.items;
               for(var idxColumn = 0; idxColumn < fields.length; idxColumn++){
                   //Agregando la propiedad
                   json += '"'+fields[idxColumn].name+'"';
                   json += ' : ';
                   json += '"'+records[index].get(fields[idxColumn].name)+'",';
               }
               //quitamos la ultima coma agregada
               json = json.substr(0,json.length - 1);
               
               //Cerrando el Objeto
               json +='},';
           }
           //quitamos la ultima coma agregada
           json = json.substr(0,json.length - 1);
           
           //Cerramos el arreglo
           json +=']';
           //Devolvemos el Objeto
           //
           return json;
       }
   } 
});


