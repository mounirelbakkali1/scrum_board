<?php
$ID= $_POST['ID'];
$ID=intval($ID);
$connection = new mysqli('localhost','root','','Youcodescumboard');
if($connection->connect_error){
 die('Connection Failed'.$connection->connect_error);
}else{
 $statement = $connection -> prepare("DELETE FROM tasks_table WHERE ID=$ID ");
 $statement->execute();
 $statement->close();
 $connection->close();
}

echo $ID;