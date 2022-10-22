<?php

// getting data from database.
$conn = mysqli_connect("localhost", "root", "", "Youcodescumboard");
// getting data from employee table
$result = mysqli_query($conn, "SELECT * FROM tasks_table");
// storing in array
$data = array();
while ($row = mysqli_fetch_assoc($result))
{
$data[] = $row;
}
// returning response in JSON format
echo json_encode($data);