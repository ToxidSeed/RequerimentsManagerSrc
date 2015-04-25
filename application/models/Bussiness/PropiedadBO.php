<?php
require_once BUSSINESSPATH.'BaseBO.php';
require_once MAPPERPATH.'PropiedadMapper.php';
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
class PropiedadBO extends BaseBO{
    function __construct() {
        parent::__construct();
    }
    protected $dmnPropiedad;
    function setDmnPropiedad(DomainPropiedad $dmnPropiedad){
        $this->dmnPropiedad = $dmnPropiedad;
    }
    function getDmnPropiedad(){
        return $this->dmnPropiedad;
    }
    function add(){
        try{
            $this->load->database();
            $this->db->trans_start();
            
            $this->checkObject();
            
            $mprEvento = new PropiedadMapper();
            $mprEvento->insert($this->getDomain());
            
            $this->db->trans_commit();
        }catch(Exception $e){
            $this->db->trans_rollback();
            throw new Exception($e->getMessage(),$e->getCode());
        }
    }
    
    function update(){
        try{
            $this->load->database();
            $this->db->trans_start();
            
            $this->checkObject();
            
            $mprPropiedad = new PropiedadMapper();
            
            $dmnCurrentPropiedad = $mprPropiedad->find($this->domain->getId());
            $dmnCurrentPropiedad->setNombre($this->domain->getNombre());            
            $mprPropiedad->update($dmnCurrentPropiedad);            
            $this->db->trans_commit();
        }catch(Exception $ex){
            $this->db->trans_rollback();
            throw new Exception($ex->getMessage(),$ex->getCode());
        }
    }
     
    
}
?>