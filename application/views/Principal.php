<html>
<head>
<!--<link rel="stylesheet" type="text/css" href="../js/app/desktop/css/desktop.css">-->
<!--<link rel="stylesheet" type="text/css" href="js/extjs/resources/ext-theme-neptune/ext-theme-neptune-all.css">-->
<script type="text/javascript" src="<?php echo base_url();?>js/extjs/examples/shared/include-ext.js?theme=gray"></script>


<script type="text/javascript">
        var path = '/RequerimentsManagerSrc/js/app/';
        base_url = '<?php echo base_url();?>'+'index.php';
        DATE_W3C = '<? echo DATE_W3C; ?>';
        
        
        Ext.Loader.setPath({
        //    'Ext.ux.desktop': path+'desktop/js',
          //  MyDesktop: path+'desktop',
            MyApp: path+'MyApp',
            Per: path+'percod'
        });

        //Ext.require('MyDesktop.App');        
        //Ext.require('Per.Config');
        Ext.require('Per.MessageBox');
        Ext.require('MyApp.WinPrincipal');
        Ext.require('MyApp.Login');
        

//        var myDesktopApp;
        Ext.onReady(function () {           
            var WinPrincipal = new MyApp.WinPrincipal();
            WinPrincipal.show();
            
            //Prompt Login Window
//            var MyWinLogin = new MyApp.Login();
//            MyWinLogin.show();         
        });
</script>

</head>
<body>
</body>
</html>