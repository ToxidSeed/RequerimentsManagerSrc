<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
require_once BASECONTROLLERPATH.'BaseController.php';
class HelpActiveProperties extends BaseController{
    function __construct() {
        parent::__construct();
    }
    public function search(){        
        $this->load->model('Mapper/Helpers/HelperPropiedades','HelperPropiedades');
        $this->HelperPropiedades->setParamNombre($this->getField('nombre'));
        $response = $this->HelperPropiedades->getList();
        echo json_encode(Response::asResults($response));                                   
   }
}
?>
