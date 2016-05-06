/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('MyApp.GestionProcesos.WinMantProcesosControl',{
    extend:'Ext.window.Window' , 
    internal:{
        id:0,
        proceso_id:0,
        //control_id:0,
        Control:{
            id:null,
            nombre:null
        },
        proceso_control_id:0
    },
    editores:{},
    editores_sel:{},
    sourceConfig:{},
    comentarios:{},
    retirados:{},
    initComponent:function(){
       // this.addEvents('saved');
        var main = this;                                     
        
        main.mainTbar =  Ext.create('Ext.toolbar.Toolbar',{
            items:[
                {
                    text:'Guardar',
                    id:'btnGuardarId',
                    iconCls:'icon-disk',
                    handler:function(){
                        main.save({
                            action:'showm'
                        });
                    }
                },
                {
                    text:'Cancelar',
                    iconCls:'icon-door-out',
                    handler:function(){
                        main.close();
                    }
                }
            ]
        });             
        
         main.storePicker = new Ext.create('Ext.data.Store',{
            remoteFilter:true,  
//            autoLoad:true,
            fields:[
                'id',
                'nombre'
            ],
            proxy:{
               type:'ajax',
               url: base_url+'Comunes_Control/ControlEstado/getControlesActivos',
               reader:{
                   type:'json',
                   root:'results',
                   totalProperty:'total'
               }
           }
       });
        
        main.txtTipoControl = Ext.create('Ext.form.ComboBox',{
            fieldLabel: 'Control',
            store: main.storePicker,
            typeAhead:true,
            queryMode: 'remote',
            queryParam:'Nombre',
            displayField: 'nombre',
            enableKeyEvents:true,
            minChars:1,
            hideTrigger:true,
            valueField: 'id',
            width:350
        });
        
        
        main.txtTipoControl.on({
            'select':function(combo,records){                
                var mySelectedRecord = records[0];
                main.internal.Control.id = mySelectedRecord.get('id');
                main.internal.Control.nombre = mySelectedRecord.get('nombre');
                //console.log(main.internal.ProcesoControlPropiedad);
                
//                console.log(main.internal);
                main.getPropiedadesSeleccionadas();
            }
        });
       
        
        
        main.btnHelpControles = Ext.create('Ext.button.Button',{
            text:'...',            
            handler:function(){
                alert('clicked');
            }
        });  
        
        main.txtNombre = Ext.create('Ext.form.field.Text',{
            fieldLabel:'Nombre',
            width:350
        });
        
        main.txtComentarios = Ext.create('Ext.form.field.TextArea',{
            fieldLabel:'Comentarios',
            width:350
        });
               
        
        main.store_propiedades = Ext.create('Ext.data.Store',{
            fields:[
                'id',
                'propiedad.id',
                'propiedad.nombre',
                'propiedad.editor.constante',
                'valor'
            ],
            proxy:{
                type:'ajax',
                url: base_url+'GestionProcesos/ProcesoControl/getPropiedadesSeleccionadas',
                reader:{
                    type:'json',
                    root:'results',
                    totalProperty:'total'
                }
            }
        });
        
        
        
        main.gridPropiedades = Ext.create('Ext.grid.Panel',{                 
         //width:350,
         height:200,
         border:true,  
         selModel:{
                mode:'SIMPLE'
            },
         store:main.store_propiedades,
         columns:[
            {
                text:'id',
                dataIndex:'id',
                hidden:true
            },
            {
                text:'Nombre',
                dataIndex:'propiedad.nombre'                    
            },{
                text:'Valor',
                dataIndex:'valor',
                flex:1,
                /*editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }*/
                getEditor:function(record){      
                   return main.crear_editores_propiedad(record.get('propiedad.id'),record.get('propiedad.editor.constante'),'sel');                  
                },
                renderer:function(value,m,record){                        
                   var mask =  main.crear_renderer(value,record.get('propiedad.id'),record.get('propiedad.editor.constante'),'sel');                                          
                   return mask;
                }
            }
         ],
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
         viewConfig:{        
           plugins:{
               ptype:'gridviewdragdrop',
               dropGroup:'myDragZone',
               dragGroup:'myDragZone'
           },
           listeners:{
               'drop':function(node,data,overModel,dropPosition,dropHandlers){
                   main.add_propiedades(data);
                   
               }
           }
         },
         pagingBar:true
      });
      
       //Ext.util.Observable.capture(main.gridPropiedades, function(){console.log(arguments)});
       //Ext.util.Observable.capture(main.gridPropiedades.getView(), function(){console.log(arguments)});
      
        //main.gridPropiedades.store.addSorted(rec);
      
      main.gridPropiedades.on({
         'itemdblclick':function(grid,record,item,index,event){
             var var_propiedad_id = record.get('name');      
             var var_params = {
                 propiedadId: var_propiedad_id
             };
             main.openWinEditor(var_params);
         },
         'itemmouseleave':function(view){
             //view.refresh();
         }
      });
      
      main.gridEventos = Ext.create('Ext.grid.Panel',{         
         border:false,                      
         loadOnCreate:false,
         width:350,
         height:400,
         pageSize:20,         
         src:base_url+'/GestionProcesos/ProcesoControl/getEventosDisponibles',
         columns:[
             {
                 xtype:'rownumberer'
             },
             {
                 header:'Nombre',
                 dataIndex:'nombre'
             },{
                 header:'eventoId',
                 dataIndex:'id',
                 hidden:true
             },{
                 header:'controlid',
                 dataIndex:'controlid',
                 hidden:true
             }
         ]
      });
      
      
       main.gridEventos.on({
         'itemdblclick':function(grid,record,item,index,event){
             var eventoName = record.get('evento.nombre');             
             main.myWinEditor.setTitle(eventoName);                          
             main.myTextAreaEditor.setValue(record.get('valor'));
             main.myWinEditor.params = {
                 method:'evento',                 
                 data:{
                     id:record.get('id'),
                     eventoId:record.get('evento.id'),
                     controlId: main.internal.Control.id,      
                     ControlEventoId: record.get('controlEvento.id')
                 }
             };
             main.myWinEditor.showAt(event.getX(),event.getY());
         } 
      });
      
      
     main.tbarPropiedades = Ext.create('Ext.toolbar.Toolbar',{
        items:[
            {
                
                text:'Agregar Propiedad',
                id:'tbtn_agregar_propiedad',
                iconCls:'icon-add',
                handler:function(){
                    //Guardar proceso control
                    var param = {
                        action:'open_p'
                    };
                    main.save(param);                                                                                                                               
                }
            }
        ] 
     });
     //revisar
        //main.on({
          //  'saved':function(){       
                //console.log('guardar');
                /*var w = main.mainPanel.getWidth();
                main.mainPanel.hide();
                main.panelPropiedadesDisponibles.setWidth(w);
                main.panelPropiedadesDisponibles.show();    */
            //}
        //});
      
        main.txtSearchPropiedades = Ext.create('Ext.form.field.Text',{
            fieldLabel:'Nombre'
        });
        
        main.panelSearchPropiedades = Ext.create('Ext.panel.Panel',{
           height:120,
           autoScroll:true,
           items:[
               main.txtSearchPropiedades
           ] 
        });
        

        main.tbarEventos = Ext.create('Ext.toolbar.Toolbar',{
           items:[
               {
                   text:'Agregar Eventos',
                   iconCls:'icon-add',
                   handler:function(){
                       var param = {
                            action:'open_e'
                       };
                       main.save(param); 
                   }
               }
           ] 
        });

      
        main.mainTab = Ext.create('Ext.tab.Panel',{
            region:'center',
           items:[
               {
                   id:'tabPropiedades',
                   title:'Propiedades',
                   tbar:main.tbarPropiedades,                   
                   items:[
                       main.gridPropiedades 
                   ]
               },{
                   id:'tabEventos',
                   title:'Eventos',
                   tbar:main.tbarEventos,
                   items:[
                        main.gridEventos
                   ]
               }
           ] 
        });
        
        //Codificando cambio de tab
        main.mainTab.on({
            tabChange:function(tabPanel,newCard,oldCard){
                //main.myWinEditor.close();
                if (newCard.id === 'tabEventos'){
                    main.getEventosSeleccionados();
                }
                if (newCard.id === 'tabPropiedades'){
                    main.getPropiedadesSeleccionadas();
                }
            }
        });
        
//        main.gridHelpControles = Ext.create('Per.GridPanel',{
//            loadOnCreate:false,
//            width:400,
//            height:400,
//             src:base_url+'',                         
////            floating:true,
//            columns:[
//                {
//                    header:'Text',
//                    dataIndex:'ControlId'
//                }
//            ] 
//        });    
        
       
        
//        main.mainPanel = Ext.create('Ext.panel.Panel',{
//            bodyPadding:'10px',
//            layout:'column',
//            items:[
//                main.txtTipoControl,
//                main.btnHelpControles,
//                main.txtDescripcion
//            ]
//        });
        
        main.mainPanel = Ext.create('Ext.panel.Panel',{
            bodyPadding:'10px',    
            region:'west',
            items: [main.txtTipoControl,
                main.txtNombre,
                main.txtComentarios]
        });
        
        main.tbarSearchPropiedades = Ext.create('Ext.toolbar.Toolbar',{
            items:[
                {
                    text:'Buscar',
                    iconCls:'icon-search',
                    handler:function(){
                        main.getPropiedadesDisponibles();
                        main.getPropiedadesSeleccionadas();
                    }
                },{
                    text:'Ocultar',
                    iconCls:'icon-collapse',
                    handler:function(){
                        main.panelPropiedadesDisponibles.hide();
                        main.mainPanel.show();
                        
                    }
                }
            ]
        });
        
        main.txtPropiedad = Ext.create('Ext.form.field.Text',{
           fieldLabel:'Propiedad' 
        });
        
        
        
        
        main.store_propiedades_disp = Ext.create('Ext.data.Store',{            
            fields:[
                'id',
                'nombre',
                'Valor',
                'editor.constante'
            ],
            proxy:{
                type:'ajax',
                url: base_url+'GestionProcesos/ProcesoControl/getPropiedadesDisponibles',
                reader:{
                    type:'json',
                    root:'results',
                    totalProperty:'total'
                }
            }
        });
        
        
//        var selModel = Ext.create('Ext.selection.CheckboxModel',{
//            mode:'MULTI'
//        });
        
        main.gridPropiedadesDisp = Ext.create('Ext.grid.Panel', {
//            title: 'Listado',            
//            width: 300,  

            height:300,
            selModel:{
                mode:'SIMPLE'
            },
            store:main.store_propiedades_disp,
            columnLines:true,
            columns:[
                {
                    text:'id',
                    dataIndex:'id',
                    hidden:true
                },
                {
                    text:'Nombre',
                    dataIndex:'nombre'                    
                },{
                    text:'Valor',
                    dataIndex:'Valor',
                    flex:1,
                    getEditor:function(record){      
//                        console.log(record);
                       return main.crear_editores_propiedad(record.get('id'),record.get('editor.constante'),'disp');
                    },
                    renderer:function(value,m,record){                        
                       var mask =  main.crear_renderer(value,record.get('id'),record.get('editor.constante'),'disp');                                          
                       return mask;
                    }
                }
            ],
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',                    
                    dragText:'Moviendo',
                    dragGroup:'myDragZone',
                    dropGroup:'myDragZone'
                },
                listeners:{
                    'drop':function(node,data,overModel,dropPosition,dropHandlers){
                        main.del_propiedades(data);
                    }
                }
            }
        });
        
        
        
        
        main.panelSearchPropiedades = Ext.create('Ext.panel.Panel',{              
               bodyPadding:'10px',  
              tbar:main.tbarSearchPropiedades,
              items:[
                  main.txtPropiedad                  
              ]
        });
        
        main.panelPropiedadesDisponibles = Ext.create('Ext.form.Panel',{
            title:'Propiedades Disponibles',   
            width:300,            
             region:'west',
              hidden:true,              
              items:[
                  main.panelSearchPropiedades,
                  main.gridPropiedadesDisp
              ]
            
        });
        
        main.store_eventos_disp = Ext.create('Ext.data.Store',{            
            fields:[
                'id',
                'nombre',
                'Valor'
                
            ],
            proxy:{
                type:'ajax',
                url: base_url+'GestionProcesos/ProcesoControl/getEventosDisponibles',
                reader:{
                    type:'json',
                    root:'results',
                    totalProperty:'total'
                }
            }
        });
        
        main.gridEventosDisp = Ext.create('Ext.grid.Panel', {
//            title: 'Listado',            
//            width: 300,  
            height:300,
            selModel:{
                mode:'SIMPLE'
            },
            store:main.store_eventos_disp,
            columnLines:true,
            columns:[
                {
                    text:'id',
                    dataIndex:'id',
                    hidden:true
                },
                {
                    text:'Nombre',
                    dataIndex:'nombre'                    
                }
            ],
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',                    
                    dragText:'Moviendo',
                    dragGroup:'myDragZone',
                    dropGroup:'myDragZone'
                },
                listeners:{
                    'drop':function(node,data,overModel,dropPosition,dropHandlers){
                        //main.del_propiedades(data);
                    }
                }
            }
        });
        
        main.tbarSearchEventos = Ext.create('Ext.toolbar.Toolbar',{
           items:[
               {
                   text:'Buscar',
                   handler:function(){
                       
                   }
               },
               {
                   text:'Ocultar',
                   handler:function(){
                       
                   }
               }
           ] 
        });
                
        main.txtSearchEventos = Ext.create('Ext.form.field.Text',{
           fieldLabel:'Evento' 
        });
        
        
        
        main.panelSearchEventos = Ext.create('Ext.panel.Panel',{
             bodyPadding:'10px',
             tbar:main.tbarSearchEventos,
             items:[
                 main.txtSearchEventos
             ]
        });
        
        main.panelEventosDisp = Ext.create('Ext.form.Panel',{
            title:'Eventos Disponibles',
            width:'300',
            region:'west',
            hidden:true,
            items:[
                main.panelSearchEventos,
                main.gridEventosDisp
            ]
        });                    
        
        Ext.apply(this,{            
           width:800,
           tbar:main.mainTbar,
           height:600,
           title:'Controles',
           modal:true,
           layout:'border',
           defaultFocus:main.txtTipoControl,
           items:[
                main.mainPanel,
                main.panelPropiedadesDisponibles,
                main.panelEventosDisp,
                main.mainTab               
           ]           
        });       
        
        main.on({
            
            'show':function(){
                main.loadControl();
                main.habilitar_controles();
            }
        });
        
          this.callParent(arguments);
    },
    loadPicker:function(){
        var main = this;
        
    },
    save:function(param){
        var main = this;      
                
        console.log(param);
                
        Ext.Ajax.request({
          url:base_url+'GestionProcesos/ProcesoControl/wrt',
          params:{
              control_id:main.internal.Control.id,
              nombre:  main.txtNombre.getValue(),   
              proceso_id: main.internal.proceso_id,
              comentarios:main.txtComentarios.getValue()              
          },
          success:function(response){
              main.process_save(param,response);
          },
          failure:function(response){
              var msg = new Per.MessageBox();               
              msg.data = Ext.decode(response.responseText);
              msg.failure();
          }
       });
    },
    process_save:function(param,response){
        var main = this;  
        if(param && param.action){
           
            //Abrir ventana de busqueda propiedades
            if(param.action === 'open_p'){
                main.open_search_window_propiedad(response);
            }            
            //Abrir ventana de busqueda eventos
            if(param.action === 'open_e'){
                main.open_search_window_evento(response);
            }
            
            //Mensaje Guardar
            if(param.action === 'showm'){
                main.show_message_after_save(response);
            }
        }        
    },
    open_search_window_propiedad:function(response){
        var main = this;
        var w = main.mainPanel.getWidth();
        main.mainPanel.hide();
        main.panelPropiedadesDisponibles.setWidth(w);
        main.panelPropiedadesDisponibles.show();
        var var_response = Ext.decode(response.responseText);
        main.internal.proceso_control_id = var_response.extradata.ProcesoControlId;
    },
    show_message_after_save:function(response){
        var main = this;
        var msg = new Per.MessageBox();               
        msg.data = Ext.decode(response.responseText);
        main.internal.proceso_control_id = msg.data.extradata.ProcesoControlId;
        if (msg === true){
            msg.success();
        }        
    },
    open_search_window_evento:function(response){
        var main = this;
        
        var w = main.mainPanel.getWidth();
        main.mainPanel.hide();
        main.panelEventosDisp.setWidth(w);
        main.panelEventosDisp.show();
        var var_response = Ext.decode(response.responseText);
        main.internal.proceso_control_id = var_response.extradata.ProcesoControlId;        
    },
    /*modify:function(msg){
        var main = this;
        Ext.Ajax.request({
          url:base_url+'GestionProcesos/ProcesoControl/upd',
          params:{
              ControlId:main.internal.Control.id,
              nombre:  main.txtNombre.getValue(),   
              ProcesoId: main.internal.Proceso.id,
              comentarios:main.txtComentarios.getValue(),
              ProcesoControlId: main.internal.ProcesoControl.id
              
          },
          success:function(response){
              var msgbox = new Per.MessageBox();  
              msgbox.data = Ext.decode(response.responseText);
              //console.log(msg.data);
              //main.internal.ProcesoControl.id = jsonResponse.extradata.ProcesoControlId;
//              console.log(main.internal);
              if (msg === true){
                  msgbox.success();
              }                                              
          },
          failure:function(response){
              var msg = new Per.MessageBox();               
              msg.data = Ext.decode(response.responseText);
              msg.failure();
          }
       });
        
    },*/
    openHelpControlsWindow:function(){
        console.log('now');
        var main = this;       
    },
    loadControls:function(){
        var main = this;
        main.storePicker.load({
            params:{
                Nombre:main.txtTipoControl.getRawValue()
            }
        });
    },
    getPropiedadesSeleccionadas:function(){
        var main = this;
;
        
        main.gridPropiedades.getStore().load({
            params:{
                    ControlId:main.internal.Control.id,
                    ProcesoControlId: main.internal.proceso_control_id
            }
        });
    },
    getEventosDisponibles:function(){
        var main = this;
        main.gridEventosDisp.getStore().load({
             params:{
                 ControlId:main.internal.id,
                 ProcesoControlId:main.internal.proceso_control_id
             } 
        });
    },
    getEventosSeleccionados:function(){
        var main = this;        
                
        main.gridEventos.getStore().load({
            params:{
                ControlId:main.internal.Control.id,
                ProcesoControlId:main.internal.proceso_control_id
            }
        });                                
    },
    loadControl:function(){
        var main = this;
        if (main.internal.id > 0){
            Ext.Ajax.request({
                url:base_url+'GestionProcesos/ProcesoControl/find',
                params:{
                    id:main.internal.id
                },
                success:function(response){
                    var object = Ext.decode(response.responseText);                    
                    main.txtTipoControl.setValue(object.data.control.nombre);
                    main.txtNombre.setValue(object.data.nombre);
                    main.internal.control_id = object.data.control.id;                    
                    //Loading Properties
                    main.getPropiedadesSeleccionadas();
                }
            });
        }
    },    
    getPropiedadesDisponibles:function(){
        var main = this;
            main.store_propiedades_disp.load(
                {
                    params:{
                     ControlId: main.internal.Control.id,
                     nombre:main.txtPropiedad.getValue(),
                     ProcesoControlId: main.internal.proceso_control_id
                     }
                 }
             );
    },
    crear_renderer_booleano:function(value){
        var main = this;
        var value_render = null;
//        console.log(value);
        switch(value){
            case '0':
                value_render = 'false';
                break;
            case '1':
                value_render = 'true';
                break;
        }
//        console.log(value_render);
        return value_render;
    },
    crear_renderer_combo:function(value,par_propiedad_id,arr_editores){
        var main = this;
        var store = arr_editores["cm"+par_propiedad_id];
        var idx = store.find('id', value);
        var rec = store.getAt(idx);
        return rec.get('id');        
    },    
    crear_renderer:function(value,par_propiedad_id,par_constante,type){
        var main = this;
        var field = null;
        var arr_editores = null;
        
        switch(type){
              case 'disp':
                  arr_editores = main.editores;
                  break;
              case 'sel':
                  arr_editores = main.editores_sel;
                  break;
          }
            
        switch(par_constante){
            case 'LISTVALUES':
                field = main.crear_renderer_combo(value,par_propiedad_id,arr_editores);
                break;
            case 'BOOLEAN':
                field = main.crear_renderer_booleano(value);
                break;
            case 'DATE':
                field =  value;
                break;
            case 'NUMBER':
                field = value;
                break;
        }
        return field;
    },
    crear_booleano:function(par_propiedad_id){
        var main = this;
        var store_booleano = Ext.create('Ext.data.Store', {        
            fields:['id','value'],
            data:[
                { 'id': '0',  "value":"false"},
                { 'id': '1',  "value":"true"}
            ]
        });
        
        return Ext.create('Ext.form.ComboBox', {           
                    store:  store_booleano,                      
                    queryMode: 'local',
                    selectOnFocus: true,                    
                    displayField: 'value',
                    valueField: 'id'          
                });
    },
    crear_combo:function(par_propiedad_id,arr_editores){
        var main = this;
          
        arr_editores["cm"+par_propiedad_id] =  Ext.create('Ext.data.Store', {   
               id:"cm"+par_propiedad_id,
               fields: ['id', 'valor'],
               proxy:{
                    type:'ajax',
                    url:base_url+'GestionProcesos/ProcesoControl/getValores',
                    reader:{
                        type:'json',
                        root:'results'
                    }
               },
               listeners:{
                   'beforeload':function(store,operation,eOpts){
                       store.getProxy().extraParams = {
                           PropiedadId:par_propiedad_id  
                       };
                   }
               }
           });
           
           return Ext.create('Ext.form.ComboBox', {           
                    store:  arr_editores["cm"+par_propiedad_id],                          
                    queryMode: 'remote',
                    selectOnFocus: true,
                    queryParam:'valor',
                    displayField: 'valor',
                    valueField: 'id'          
                });
    },
    crear_editores_propiedad:function(par_propiedad_id,par_constante,type){
            var main = this;        
            var field = null;
            var arr_editores = null;
            
            switch(type){
                case 'disp':
                    arr_editores = main.editores;
                    break;
                case 'sel':
                    arr_editores = main.editores_sel;
                    break;
            }
            
            switch(par_constante) {
                case 'LISTVALUES':
                    field = main.crear_combo(par_propiedad_id,arr_editores);
                    break;
                case 'BOOLEAN':
                    field = main.crear_booleano(par_propiedad_id,arr_editores);
                    break;
                case 'DATE':
                    field =  Ext.create('Ext.form.field.Date');
                    break;
                case 'NUMBER':
                    field = Ext.create('Ext.form.field.Number');  
                    break;
            }
           
           return Ext.create('Ext.grid.CellEditor', {
                field: field
            });                                 
    },
    openWinEditor:function(object){
        var main = this;
        
        main.myTextAreaEditor = Ext.create('Ext.form.field.TextArea',{
            width:350,
            height:150
        });
        main.myWinEditor = Ext.create('Ext.window.Window',{             
             width:350,
             height:200,  
             title:'Comentarios',
             //closeAction:'hide',
//             closable:false,
             modal:true,
             params:{
                method:null,
                data:{}
             },
             defaultFocus: main.myTextAreaEditor,
             items:[
                 main.myTextAreaEditor
             ],
             buttons:[
                 {
                     text:'Aceptar',
                     handler:function(){                         
                         main.comentarios[object.propiedadId] = main.myTextAreaEditor.getValue();                         
                         console.log(main.comentarios);
                     }
                 },
                 {
                     text:'Salir',
                     handler:function(){
                         main.myWinEditor.hide();
                     }
                 }
             ]
        });
        
        main.myWinEditor.show();
    },
    add_propiedades:function(data){
        var main = this;        
        var records = data.records;

                
        var var_propiedad_id;
        var var_propiedades = "[";
        for(var idx in records){         
//            console.log(records);
            var_propiedad_id = records[idx].get('id');
            var_propiedades+='{"propiedad_id":"'+var_propiedad_id+'",';
            var_propiedades+='"valor":"'+records[idx].get('Valor')+'",';
            var_propiedades+='"comentarios":"'+main.comentarios[var_propiedad_id]+'"},';                       
        }
        var_propiedades = var_propiedades.slice(0,-1);
        var_propiedades+="]";
        
        //Begin Ajax request here
        var proceso_control_id = main.internal.proceso_control_id;
        
        Ext.Ajax.request({
          url:base_url+'GestionProcesos/ProcesoControl/add_propiedades',
          params:{
            proceso_control_id:proceso_control_id,
            propiedades: var_propiedades,
            control_id: main.internal.Control.id
          },
          success:function(response){
//             console.log(response.responseText);
             main.getPropiedadesDisponibles();
             main.getPropiedadesSeleccionadas();
          }
       });
    },   
    del_propiedades:function(data){
        var main = this;
        var records = data.records;
        //console.log(records);
        var records_to_del = [];
        for (var idx in records){
            var row = {proceso_control_propiedad_id:records[idx].get('id')};
            records_to_del.push(row);
        }        
        
        var proceso_control_id = main.internal.proceso_control_id;
        var var_propiedades = Ext.JSON.encode(records_to_del);        
        
        Ext.Ajax.request({
          url:base_url+'GestionProcesos/ProcesoControl/del_propiedades',
          params:{
            proceso_control_id:proceso_control_id,
            propiedades: var_propiedades,
            control_id: main.internal.Control.id
          },
          success:function(response){
             main.getPropiedadesDisponibles();
             main.getPropiedadesSeleccionadas();
          }
       });
        
        //return Ext.JSON.encode(records_to_del);        
    },    
    habilitar_controles:function(){
        var main = this;
        //check si es un registro nuevo
        var tbtn_agregar_propiedad = Ext.getCmp('tbtn_agregar_propiedad');    
        if(main.internal.proceso_control_id === 0){
            tbtn_agregar_propiedad.disable();
        }else{
            tbtn_agregar_propiedad.enable();
        }
    }
});