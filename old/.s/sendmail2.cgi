#!/usr/local/bin/perl


print "Content-type: text/html\n\n";

# タイトルヘッダーを書く

print "<html>\n";
print "<head>\n";
print "<title>Messages</title>\n";
print "<link rev=made href=\"mailto\:www-admin\@kaz-ass.com\">\n";
print "<META http-equiv=\"Content-Type\" content=\"text/html\; charset=EUC-JP\">\n";
print "</head>\n";
print "<body bgcolor=\"#FFFFFF\" text=\"#666666\" link=\"#0064BE\" alink=\"#FFB4BE\" vlink=\"#9164FF\">\n";


# Get the input
read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});
# Split the name-value pairs
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

$TZone          = '+0900';
@WDay = ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
@Month = ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');

($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
  $year00 = 1900 + $year  ; if ( $year  >= 100 ) { $year =  $year -100  ;  } #2000.01.01
$Now = sprintf("%02d/%02d/%02d %02d:%02d:%02d", $year, $mon+1, $mday, $hour, $min, $sec);

$wday = $wday -1 ;

if ($wday == 0) { $wday = 7; }
$MailDate = sprintf("%s, %02d %s %04d %02d:%02d:%02d %s", $WDay[$wday], $mday, $Month[$mon], $year00, $hour, $min, $sec, $TZone);


$mbin="/usr/local/bin2" ;

if ( ( -x "$mbin/get_domain_from_sites" ) && ( -x "$mbin/get_admin_sites_by_get_domain.perl2.550" ) ) { ; }
else { 
system ( "echo $0 canot find $mbin/get_domain_from_sites $mbin/get_admin_sites_by_get_domain.perl2.550 | /bin/mail -s $0 tech\@ns1.kabir-ken.com"  ) ; 
print " $0 : 必要な コマンドが見付かりません。<BR>\n" ; exit 1 ; 
}

$domain=`$mbin/get_domain_from_sites -pwd 2>/dev/null` ; chop $domain ;
$user=`$mbin/get_admin_sites_by_get_domain.perl2.550 -adminuser $domain 2>/dev/null` ;  chop $user ;

if ( ( $user eq "" )  || ( $user =~ /BAD/ ) || ( $domain eq "" )  || ( $domain =~ /BAD/ ) )
{
system ( "echo BAD: $0 canot get domain=$domain user=$user  | /bin/mail -s $0 tech\@ns1.kabir-ken.com"  ) ; 
print "domain=$domain user=$user  が取得できません 。<BR>\n" ; exit 1 ;
}

$fromaddress= $user . "@" . $domain ;


print "To_address="  . $ENV{'QUERY_STRING'} . "<BR>\n" ; 

$to=$ENV{'QUERY_STRING'}  ;

if ( $to =~ /\@/ ) { ; }
else { print "$to is bad address <BR><BR>\n" ;
	&usage( $domain ) ; 
exit 1 ; }

if ( -x "/usr/local/bin/nkf" ) { $nkf="/usr/local/bin/nkf" ; }
elsif ( -x "/usr/bin/nkf" ) { $nkf="/usr/bin/nkf" ; }
else { print "nkf notfound <BR>\n" ; exit 1 ;}

	if ( open ( MAIL, "| $nkf -j | /usr/sbin/sendmail2 -t" ) ) { ; }
	else {print "$0: cannot open MAIL <br>\n" ; exit 1 ;}



print MAIL  "To: $to\n" ; 
print MAIL  "From: $fromaddress\n" ; 
print MAIL  "X-to: SJ23JN3Y\n" ; 
print MAIL  "Subject: Test by http://www.$domain/.s/sendmail2.cgi?$to\n" ; 
print MAIL  "\n\n" ; 

print MAIL "This is a test by http://www.$domain/.s/sendmail2.cgi?$to\n\n" ; 
print MAIL "From: $fromaddress\nTo: $to\n\n$MailDate\n" ; 

print MAIL "cgi プログラム \nhttp://www.$domain/.s/sendmail2.cgi?$to\n によって\n" ; 
print MAIL "$MailDate \nに\nFrom: $fromaddress \nから\n To: $to \n へ\n" ; 
print MAIL "メールが送信されました。届いたかどうかご連絡ください。。\n" ; 


close MAIL ;

print "<BR>\nThis is a test by http://www.$domain/.s/sendmail2.cgi?$to<BR>\n" ; 
print "From: $fromaddress<BR>\nTo: $to<BR><BR>\n$MailDate<BR>\n" ; 

print "<BR><BR>\n この cgi プログラム <BR> http://www.$domain/.s/sendmail2.cgi?$to <BR> によって<BR>\n" ; 
print "$MailDate <BR> に<BR> From: $fromaddress <BR> から<BR>\n To: $to <BR> へ<BR>\n" ; 
print "メールが送信されました。届いたかどうか確認ください。<BR>\n" ; 

exit 0 ;


sub usage
{
	local ( $domain) = @_ ;

	print "USAGE sample:  http://www.$domain/.s/sendmail2.cgi?tech\@ns1.kabir-ken.com<BR>\n" ; 
	print "使用方法例: http://www.$domain/.s/sendmail2.cgi?tech\@ns1.kabir-ken.com<BR>\n" ;
	print "使用方法例: ?の右にメールアドレスを入力して改行を押してください。<BR>\n" ;
}

