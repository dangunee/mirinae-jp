#!/usr/bin/perl

$mbin="/usr/local/bin2" ;
$domain=`$mbin/get_domain_from_sites -pwd` ; chop $domain ;

$prog="$0" ; 
if ( $prog =~ /.*\/web\/(\S+)/ ) { $prog0 = $1 ; }

print "Content-type: text/html\n\n";
$debug ="TEST";
print "<HTML>\n";

print "<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=euc-jp\">\n";

print "<Head><Title> www.$domain </Title></Head>";
print "<BODY bgcolor=\"#FFFFFF\">" ;

print " http://www.$domain/$prog0 ¤Ï ¥µ¥ó¥×¥ë cgi ¤È¤·¤ÆÀµ¾ïÆ°ºî¤·¤Æ¤ª¤ê¤Þ¤¹¡£ \n" ;

print " <!--- ¤³¤Á¤é¤Î¥á¥Ã¥»¡¼¥¸¤¬¸«¤¨¤ë¾ì¹ç¤Ï cgi ¤¬Æ°ºî¤·¤Æ¤ª¤ê¤Þ¤»¤ó¡£ ´ÉÍý²èÌÌ¤Ç cgi ¤òµö²Ä¤ËÀßÄê¤¯¤À¤µ¤¤¡£--> \n" ;
print " <!--- ¤â¤Á¤í¤ó¥Ö¥é¥¦¥¶¤Î ¥½¡¼¥¹¤ò¸«¤ë¤ ¤Ç ¤´Í÷¤Ê¤ì¤ë¤Î¤Ï  ¤³¤ÎÀ ¥á¥Ã¥»¡¼¥¸¤¬¸æÍ÷¤Ë¤Ê¤ì¤ë¤Î¤Ï ï Àµ¾ï¤ÊÆ°ºî¤Ç¤¹¡££--> \n" ;


print "</PRE>\n" ;


print "</Body>";
print "</HTML>\n";


exit  ;

