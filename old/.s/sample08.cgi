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

print "Test of CGI http://www.$domain/$prog0<BR>\n" ;

print "<PRE>\n" ;

print << 'EOF' ;

#!/usr/bin/perl

print "Content-type: text/html\n\n";
print "&lt;HTML&gt;\n";

print "&lt;META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=euc-jp\"&gt; \n";

EOF

print "print \"&lt;Head&gt;&lt;Title&gt; www.$domain &lt;/Title&gt;&lt;/Head&gt; \\n\"; \n";

print << 'EOF' ;

print "&lt;BODY bgcolor=\"#FFFFFF\"&gt;" ;

EOF

print "print \"Test of CGI http://www.$domain/$prog0&lt;BR&gt;\\n\"; \n";


print << 'EOF' ;


print "&lt;/Body&gt;";
print "&lt;/HTML&gt;\n";


exit  ;


EOF

print "</PRE>\n" ;


print "</Body>";
print "</HTML>\n";


exit  ;

