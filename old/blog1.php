<?php
	require_once("./snoopy.php");
	$snoopy = new snoopy;
	$uri = "http://mirinae.jp/blog/?cat=".$_GET['cat']; 
	$snoopy->submit($uri);
	
//	var_dump($snoopy->results);
	/*
$regexp = "<a\s[^>]*href=(\"??)([^\" >]*?)\\1[^>]*>(.*)<\/a>";
  if(preg_match_all("/$regexp/siU", $snoopy->results, $matches)) {
    // $matches[2] = array of link addresses
    // $matches[3] = array of link text - including HTML code
    //var_dump($matches);
    echo $matches[0][2];
    echo $matches[0][3];
    echo $matches[0][4];
    echo $matches[0][5];
    echo $matches[0][6];
  }
  */

	preg_match_all("/\<h1 class\=\"entry\-title\"\>(.*)\<\/h1\>/",$snoopy->results,$result);

	if(isset($result[1]) && !empty($result[1])){
		$i = 1;
		echo "<ul class='news'>";
		foreach ($result[1] as $k => $v) {
			if($i++ > 8) break;
			echo "<li><h5 class='date'>".$v. "</h5></li>";
		}
		echo "</ul>";	
	}
?>
	

