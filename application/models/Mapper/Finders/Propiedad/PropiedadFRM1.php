<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require_once MAPPERPATH.'PropiedadMapper.php';
/**
 * Description of PropiedadFRM1
 *
 * @author usuario
 * @descripcion: Clase que obtiene todas aquellas propiedades que NO se encuentran seleccionadas
 * por un control de un proceso en particular
 */
class PropiedadFRM1 extends PropiedadMapper {
    //put your code here
    public function __construct() {
        parent::__construct();
    }   
    
    public function search(array $filters = null){
        $this->load->database();
        $this->db->select($this->fields);
        $this->db->from($this->tableName);
        $this->db->join('procesocontrolpropiedad',
                                'propiedad.id = procesocontrolpropiedad.propiedadid and '.
                                'propiedad.controlid = procesocontrolpropiedad.controlid and '.                                
                                'procesocontrolpropiedad.procesocontrolid = '.$filters['ProcesoControlId']
                ,'left');
        $this->db->where('IFNULL(procesocontrolpropiedad.propiedadid,0)',0);
        $this->db->where('propiedad.controlid',$filters['ControlId']);
        $response = $this->db->get();    
        //echo $this->db->last_query();
        $arrResponse = $this->getMultiResponse($response);
        return new ResponseModel($arrResponse,count($arrResponse));
    }
}
