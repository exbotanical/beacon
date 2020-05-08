<?php   
/* NOTES on Irongeek's logo script:
To use this php script as a sig most boards will need it to have a png extension.
To do this, put a redirect from a png file to the php file in your apache config file (httpd.conf). 
Example line:
	Redirect /logo.png /logo.php

Consider this code to be GPLed, but I'd love for you to email me at Irongeek@irongeek.com with any changes you make. 
More information about using php and images can be found at http://us3.php.net/manual/en/ref.image.php

Adrian Crenshaw
http://www.irongeek.com
*/
	header("Content-type: image/png");
	//header("Content-type: text/html");
	$im    = imagecreatefrompng("logobase.png");
	$green=imagecolorallocate($im, 0, 100, 0);
	//imagecolortransparent ( $im,imagecolorallocate($im, 255, 255, 255));
	imagestring($im, 1, 90, 0, $_SERVER['REMOTE_ADDR'], $green);
	$hostname=gethostbyaddr($_SERVER['REMOTE_ADDR']);
	imagestring($im, 1, 90, 10,$hostname, $green);
	$os=find_os();
	imagestring($im, 1, 90, 20, $os, $green);
	$browser=$_SERVER['HTTP_USER_AGENT'];  //find_browser();
	print_long_line($browser,90,30, imagecolorallocate($im, 0, 0, 255), $im);
	imagestring($im, 1, 90, 80, whois_info(), $green);

	imagepng($im);
	imagedestroy($im);
// Begin DB code
include 'config.php';
include 'opendb.php';
$query = 'CREATE TABLE hitlog( '.
		 'cid INT NOT NULL AUTO_INCREMENT, '.
         'hostname TEXT, '.
         'ip TEXT, '.
		 'os TEXT, '.
		 'browser TEXT, '.
		 'city TEXT, '.
		 'referer TEXT, '.
		 'date DATETIME, '.
		 'PRIMARY KEY(cid))';	

		 
$result = mysql_query($query);
$query = "INSERT INTO hitlog(hostname, ip, os, browser, city, referer, date) VALUES ('".
	$hostname . "', '".
	$_SERVER['REMOTE_ADDR'] . "', '".
	$os . "', '".
	$browser. "', '".
	whois_info( ) . "', '".
	$_SERVER['HTTP_REFERER']. "', ".
	" now() )";
	
$result = mysql_query($query);
include 'closedb.php';
// End DB code

function whois_info(  )
{
	$wresults =shell_exec("whois ".$_SERVER['REMOTE_ADDR']);
	$fs = strpos($wresults, "City: ", 0);
	if ($fs==0){$city = '';}  else {
		$ls = strpos($wresults, "\n", $fs);
		$results = substr($wresults,$fs,$ls-$fs);
		$crap=array("City:", "  ");
		$city = str_replace($crap,"",$results);
	}
	$fs = strpos($wresults, "StateProv: ", 0);
		if ($fs==0){$state = '';} else {
		$ls = strpos($wresults, "\n", $fs);
		$results = substr($wresults,$fs,$ls-$fs);
		$crap=array("StateProv:", "  ");
	$state = str_replace($crap,"",$results);
	}
	
	$fs = strpos($wresults, "Country: ", 0);
	if ($fs==0){$country = '';}  else {
		$ls = strpos($wresults, "\n", $fs);
		$results = substr($wresults,$fs,$ls-$fs);
		$crap=array("Country:", "  ");
		$country = str_replace($crap,"",$results);
	}
	$results = $city . " " . $state . " " . $country;
	
	return  $results;
}



function print_long_line($string, $offset, $line, $color, $im){
	$string=$string.' ';
	$slen=strlen($string);
	if ($slen>33){
		$splitspace = strpos($string, " ", 33);
		imagestring($im, 1, $offset, $line, substr($string,0,$splitspace), $color);
		print_long_line(substr($string,$splitspace ,$slen),$offset, $line+10, $color, $im);
	}else{
		imagestring($im, 1, $offset, $line, $string, $color);
	}
}


function find_os()
{
$browserarray=explode("; ",$_SERVER['HTTP_USER_AGENT']);
$os= $browserarray[2];  
return $os;
}

function find_browser()
{
$browserarray=explode("; ",$_SERVER['HTTP_USER_AGENT']);
if ($browserarray[1]=="U"){
	$browser = $browserarray[3].$browserarray[4];
}else {
	$browser = $browserarray[1];
}
return $browser;
}

?> 
