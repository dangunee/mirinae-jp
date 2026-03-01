<HTML>

<HEAD>

<META http-equiv="Content-Type" content="text/html; charset=euc-jp">

<TITLE>PHP TEST </TITLE>

</HEAD>

<BODY>

<font size="6">PHP command TEST</font>

<BR>


<?
$ip=getenv("REMOTE_ADDR") ; 
$host=gethostbyaddr( $ip ) ; 
print "hostname=" . gethostbyaddr( getenv("REMOTE_ADDR")) . "<BR>\n" ;  
print "ip=$ip<BR> host=$host<BR>\n" ; 
echo "Remote Address: $REMOTE_ADDR<br>\n";

////phpinfo() ;

?>

<BR>

<?for ($i = 0; $i < 5 ; $i++): ?>
<tr>
<a>  <? echo  $i . "    " ; system ( "/bin/date") ;   ?> </a> 
<td colspan="4"><hr size="1"></td>
</tr>
<? endfor ;  ?>

</BODY>

</HTML>



