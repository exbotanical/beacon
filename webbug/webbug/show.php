<?php
include 'config.php';
include 'opendb.php';

$query  = "SELECT * FROM hitlog LIMIT 0 , 300";
$result = mysql_query($query);
echo '<TABLE border="1">';
while($row = mysql_fetch_array($result, MYSQL_ASSOC))
{
echo "<TR><TD><font color=\"#ff0000\">{$row['hostname']}</font></TD><TD>{$row['ip']}</TD><TD>{$row['os']}</TD><TD>{$row['browser']}</TD><TD>{$row['city']}</TD><TD>{$row['referer']}</TD><TD>{$row['date']}</TD></TR>";
}
echo "</TABLE>";
include 'closedb.php';
?>
