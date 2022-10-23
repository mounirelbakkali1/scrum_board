<?php
$ID=0;
if(isset($_GET['ID'])){
   $ID = $_GET['ID'];
}
$ID = intval($ID);
//var_dump($ID);
$title = $_POST['title'];
$type = $_POST['type'];
$status = $_POST['status'];
$priority = $_POST['priority'];
$bg = $_POST['background'];
$date = $_POST['date'];
$desc = $_POST['description'];
// DATA BASE CONNRCTION 

$connection = new mysqli('localhost','root','','Youcodescumboard');
if($connection->connect_error){
 die('Connection Failed'.$connection->connect_error);
}else{
 $statement = $connection -> prepare("UPDATE tasks_table SET  TITLES=? ,TYPES=? , PRIORITIES=?, ETTIQUETTES=?,_STATUS=?,_DATE=?,DESCRIPTIONS=? WHERE ID=$ID ");
 $statement->bind_param("sssssss",$title,$type,$priority,$bg,$status,$date,$desc);
 $statement->execute();
 $statement->close();
 $connection->close();
}
//var_dump("hello");
header('Location: http://localhost/sb_v2/');


// $people_json = file_get_contents('user.json');
 
// $decoded_json = json_decode($people_json, false);

// var_dump($decoded_json);