http://kvhbk.kabir-ken.com/knkn2/kkdata/555_php.html 参照
<HTML>

<?


function mail555 ( $to , $subject, $mes , $header , $from )
{

	$pipe = popen ( "/usr/local/bin/nkf -j | /usr/sbin/sendmail -f $from -t" ,"w") ;
        if ( $pipe ) {; } else { print "canot popen sendmail -f $from -t  <BR>\n" ; return (-1)  ; }

	fwrite ( $pipe , "To: $to\n" ) ;
	fwrite ( $pipe , "Subject: $subject\n" ) ;
	if ( $header != "" ) { fwrite ( $pipe , "$header\n" ) ; }
 	fwrite ( $pipe , "\n\n" ) ;
 	fwrite ( $pipe , "$mes\n" ) ;
 
 	pclose ( $pipe) ;

	return (0) ;

}


 print "<meta http-equiv=\"content-type\" content=\"text/html;charset=euc-jp\">\n" ;

/// phpinfo() ; exit  ;

$to= $_SERVER["QUERY_STRING"] ;

$url= $_SERVER["SCRIPT_URI"] ;

	if (( $to != "" )  && ( preg_match ( "/\@/", $to , $regs ) ) ) { ; }
 	else 
	{
		print "このURLの後に ?メールアドレス を付加してください。<BR>\n" ;
		print "例: $url?tech@ns1.kabir-ken.com<BR>\n" ;
		 exit ;
	}		


$mes01="Sorry This test mail " ; 
$fromaddress="tech@ns1.kabir-ken.com" ;
$header00= "cc: tech@ns1.kabir-ken.com" ; 

$subject = "Testmail sorry" ;


mail555 (  $to , $subject , $mes01 , $header00, $fromaddress  ) ;  

print "下記メールを送信しました。<BR><BR> to= $to <BR> Subject= $subject <BR> message = $mes01 <BR> From: $fromaddress <BR>\n" ; 


?>
</HTML>
