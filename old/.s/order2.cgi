#!/usr/local/bin/perl

print "Content-type: text/html\n\n";

print "DEBUGaa1---001 <BR>\n" if $debug eq "YES" ;


$debugporting = "NO" ;


print "<html>\n";
print "<head>\n";
print "<title>Messages</title>\n";
print "<link rev=made href=\"mailto\:www-admin\@ns1.kabir-ken.com\">\n";
print "<META http-equiv=\"Content-Type\" content=\"text/html\; charset=EUC-JP\">\n";
print "</head>\n";
print "<body bgcolor=\"#FFFFFF\" text=\"#666666\" link=\"#0064BE\" alink=\"#FFB4BE\" vlink=\"#9164FF\">\n";
print "<table border=\"0\" width=\"100%\">\n";
print "<tr>\n";
print " <th width=\"60%\"><font size=\"5\">Messages</font><br>\n";
print " </th>\n";
print " <th width=\"20%\" align=\"right\">";
print " <a href=\"http\://www.ns1.kabir-ken.com/\">\n";
print " </th>\n";
print "</tr>\n";
print "</table>\n";
print "<hr>\n";
print "<blockquote>\n";


read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});
@pairs = split(/&/, $buffer);
foreach $pair (@pairs)
{
    ($name, $value) = split(/=/, $pair);
    # Un-Webify plus signs and %-encoding
    $value =~ tr/+/ /;
    $value =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack("C", hex($1))/eg;
    # Stop people from using subshells to execute commands
    # Not a big deal when using sendmail, but very important
    # when using UCB mail (aka mailx).
    # $value =~ s/~!/ ~!/g; 
    # print "Setting $name to $value<P>";
    $FORM{$name} = $value;
}

$MAINTAINER = "tech\@ns1.kabir-ken.com" ;
$TZone          = '+0900';
@WDay = ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
@Month = ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');

($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
  $year00 = 1900 + $year  ; if ( $year  >= 100 ) { $year =  $year -100  ;  } #2000.01.01
$Now = sprintf("%02d/%02d/%02d %02d:%02d:%02d", $year, $mon+1, $mday, $hour, $min, $sec);
if ($wday == 0) { $wday = 7; }
$MailDate = sprintf("%s, %02d %s %04d %02d:%02d:%02d %s", $WDay[$wday], $mday, $Month[$mon+1], $year00, $hour, $min, $sec, $TZone);





print "<PRE>\n" ;
print   "日付: $Now\n" ; 
print   "名前: $FORM{'NAME'}\n" ; 
print   "フリカナ: $FORM{'furigana'}\n" ;
print   "電子メール: $FORM{'Email'}\n" ;
print "\n表示テストです。\n" ; 
print "</PRE>\n" ;

 exit 0 ;


exit 0 ;






