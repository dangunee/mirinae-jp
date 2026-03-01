<?php
	require_once("./snoopy.php");
	$snoopy = new snoopy;
	$uri = "http://mirinae.jp/blog";
	$snoopy->submit($uri);
//	var_dump($snoopy->results);
	preg_match_all("/\<h1 class\=\"entry\-title\"\>(.*)\<\/h1\>/",$snoopy->results,$result);

	if(isset($result[1]) && !empty($result[1])){
		$i = 1;
		foreach ($result[1] as $k => $v) {
			if($i++ > 5) break;
			if($i %2 == 0)
				$sClass = "wline";
			else
				$sClass = "gline";

			echo '<span class="'.$sClass.'"> '.str_replace("a href", "a class='more-link' href", $v).' </span>';
		}

	}
?>
	