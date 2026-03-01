<? 

$mbin="/usr/local/bin2" ;
$date00 = date("YmdHis") ; 

$domain=`$mbin/get_domain_from_sites -pwd` ;

$domain= str_replace ( "\n", "" ,  $domain ) ;

if ( strcmp ( $QUERY_STRING, "" ) == 0 ) 
{

print "<HTML> " ;
print "<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=euc-jp\"> " ;
print "<Head><Title> Support_Admin $domain </Title></Head><BODY bgcolor=\"#FFFFFF\"> " ;
print "<PRE> " ;

print "Date:  $date00 <BR><BR>" ;  

print " <TR> <TD>\n" ;
print "１、cgi のテスト <A HREF=\"tests.cgi\">http://www.$domain/.s/tests.cgi </A>\n" ;
print "</TD><TD>\n" ;
print " <TR> <TD>\n" ;
print "２、 CGI停止情報 \n" ;
print "</TD><TD>\n" ;

	$dir = "." ;

   if (  check_dir ($dir ) == 1 )
   {
 	print " 停止10-15分後に 再開されます。 <BR><BR> \n" ;
 	print "<TABLE width=\"450\">\n" ;

        $handle=opendir ( $dir ) ;

        while ( $file = readdir ($handle))
        {
	     if ( preg_match( "/index.html.(\d+)/" , $file , $arr2 ) )

		{ $filenum= $arr2[1] ;  

 	print " <TR> <TD>\n" ;
	print "<A HREF=\"cgi.php?$file\"> $filenum</A>\n" ;
 	print "</TD><TD>\n" ;
		}
 	}
 	print "</TABLE>\n" ;

        closedir ($handle ) ; 

     }
     else { print "$domain のCGI の停止はありません。<BR>\n" ; }

print "</PRE></Body></HTML>" ;

	exit   ;
}
 else 
{

print "<HTML> " ;
print "<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=euc-jp\"> " ;
print "<Head><Title> Support_Admin <? print $domain ?> </Title></Head><BODY bgcolor=\"#FFFFFF\"> " ;
print "<PRE> " ;


 	$file00=$QUERY_STRING  ;

	if (
	  (  strcmp ( $file00 , "" ) != 0 ) 
		&& file_exists ( $file00 )
	      && 
	 preg_match( "/index.html.(\d+)/" , $file00 , $arr2 ) 
		 ) 
	{  
	$file01 = $arr2[1] ; 
	print "file:  $file01" ;  
	print_file  (  $file00 )  ;
	}
	else { print "$prog canot find file=$file00 <BR>\n" ; exit ; }

print "</PRE></Body></HTML>" ;

	exit ;
}
?>


<?
function print_file ( $filename )
{
$fp = fopen ( $filename ,"r") ;
while (!feof($fp)) {

  $buffer = fgets($fp, 4096);

	print $buffer ; 

    }
    fclose($fp);
return ;
}

function check_dir ($dir ) 
{
        $handle=opendir ( $dir ) ;

        while ( $file = readdir ($handle))
        {
	     if ( preg_match( "/index.html.(\d+)/" , $file , $arr2 ) )
		{
        	closedir ($handle ) ; return 1 ;
		}
 	}
        closedir ($handle ) ; return 0 ;
}

?>

