<?php
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
require_once BASEMODELPATH.'BaseMapper.php';
require_once DOMAINPATH.'DomainSysUsuario.php';

class SysUsuarioMapper extends BaseMapper{
    function __construct() {
        parent::__construct();
    }
    protected $fields = array(
        'sysusuario.id',
        'sysusuario.nombre',
        'sysusuario.fecharegistro',
        'sysusuario.fechaactualizacion',
        'sysusuario.email',
        'sysusuario.passusr'
    );
    
    protected $uniqueValues = array(
        array('id'),
        array('email')
    );    
    
    protected $tableName = 'SysUsuario';
    
    protected function doCreateObject(array $record = null){
        $dmnSysUsuario = new DomainSysUsuario($record['ID']);
        $dmnSysUsuario->setNombre($record['NOMBRE']);
        $dmnSysUsuario->setFechaRegistro($record['FECHAREGISTRO']);
        $dmnSysUsuario->setFechaActualizacion($record['FECHAACTUALIZACION']);
        $dmnSysUsuario->setEmail($record['EMAIL']);
        $dmnSysUsuario->setPassusr($record['PASSUSR']);
        return $dmnSysUsuario;
    }
}

?>
