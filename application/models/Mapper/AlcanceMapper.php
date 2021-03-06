<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require_once BASEMODELPATH.'BaseMapper.php';
require_once DOMAINPATH.'DomainAlcance.php';

class AlcanceMapper extends BaseMapper{
    function __construct() {
        parent::__construct();
    }

    protected $fields = array(
       'id',
       'tipoId',
       'itemId',
       'entregaId'
    );

    protected $uniqueValues = array(
      array('id'),
      array('tipoid',
            'itemid')
    );

    protected $tableName = 'alcance';

    protected function doCreateObject(array $record = null){
        $dmnAlcance = new DomainAlcance($record['ID']);
        $dmnAlcance->setFechaCierre($record['FECHACIERRE']);
        return $dmnAlcance;
    }

    public function insert(DomainAlcance $dmnAlcance){
        $this->doInsert($dmnAlcance);
    }

    protected function doInsert(DomainAlcance $dmnAlcance){
        //$field['fechacierre'] = $dmnAlcance->getFechaCierre();
        $field['tipoid'] = $dmnAlcance->getTipo()->getId();
        $field['itemid'] = $dmnAlcance->getItem()->getId();
        $field['entregaid'] = $dmnAlcance->getEntrega()->getId();
        $this->db->set($field);
        $res = $this->db->insert($this->tableName);
        $dmnAlcance->setId($this->db->insert_id());
        if(!$res){
            $this->db->trans_rollback();
            throw new Exception('Error al Insertar Alcance',-1);
        }
    }

    public function update(DomainAlcance $dmnAlcance){
        $this->doUpdate($dmnAlcance);
    }
    protected function doUpdate(DomainAlcance $dmnAlcance){
        $field['fechacierre'] = $dmnAlcance->getFechaCierre();
    }
    public function delete(DomainAlcance $dmnAlcance){
      $this->doDelete($dmnAlcance);
    }
    protected function doDelete(DomainAlcance $dmnAlcance){
        $this->db->where('id',$dmnAlcance->getId());
        $this->db->delete('alcance');
    }
}
