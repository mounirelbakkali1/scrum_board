var arrOfTask;
var obj;
function reloadTasks() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost/sb_v2/assets/php/getting_data.php", true);
  xhr.onreadystatechange = () => {
    if (xhr.status === 200 && xhr.readyState === XMLHttpRequest.DONE) {
      obj = JSON.parse(xhr.responseText);
      //console.log("here :" + obj[0]._DATE);
      document.getElementById("to-do-parent").innerHTML = "";
      document.getElementById("doing-parent").innerHTML = "";
      document.getElementById("done-parent").innerHTML = "";
      let parent;
      let to_do_counter = 0,
        doing_counter = 0,
        done_counter = 0;
      // if (obj.length == 0) window.location.reload();
      // arrOfTask.forEach((task) => {
      for (let index = 0; index < obj.length; index++) {
        let icon;
        if (obj[index]._STATUS == "To Do") {
          parent = "to-do-parent";
          to_do_counter++;
          icon = "icon-wait.png";
        } else if (obj[index]._STATUS == "In Progress") {
          parent = "doing-parent";
          doing_counter++;
          icon = "loading.png";
        } else {
          parent = "done-parent";
          done_counter++;
          icon = "check.png";
        }
        // TITLES, TYPES, PRIORITIES, ETTIQUETTES, _STATUS, _DATE, DESCRIPTIONS;
        let template = `
    <div class="task pb-2" id="task_${obj[index].ID}" >
      <div class="card-task p-2" style="background-color: var(--card-color);">
        <div class="d-flex" id="task-info">
          <div  class="d-flex justify-content-center align-middle p-2"><img src="./assets/img/${icon}" style="width: 25px;height: 25px;" alt="icon-wait"></div>
            <div class="flex-fill p-2">
              <h6 style="width:85%;">${obj[index].TITLES}</h6>
              <p  class="mb-1">#${obj[index].ID} Assigned at ${obj[index]._DATE}</p>
              <p class="mb-1">${obj[index].DESCRIPTIONS}</p>
            </div>
            <button class="edit bg-transparent" onclick="editTask(${obj[index].ID})"><i class="bi bi-pencil-square"></i></button>
            <button class="delete bg-transparent"  onclick="deleteTask(${obj[index].ID})"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="d-flex justify-content-end pe-2">
            <button class="px-4" id="type" style="background-color: var(--main-color) ; color: var(--secondary); border:none;  margin-left:5px;border-radius: 10px;" >${obj[index].TYPES}</button>
            <button class="bg-transparent px-4" id="priority" style="border: 2px var(--main-color) solid; margin-left:5px;border-radius: 10px; color:var(--main-color) ;">${obj[index].PRIORITIES}</button>
          </div>  
      </div>
    </div>
    `;
        document.getElementById(parent).innerHTML += template;
      }
      document.getElementById("to-do-counter").innerText = to_do_counter;
      document.getElementById("doing-counter").innerText = doing_counter;
      document.getElementById("done-counter").innerText = done_counter;
    }
  };
  xhr.send();
}

function verifyInputs(title, date, description) {
  let valid = true;
  if (
    title == "" ||
    title == null ||
    description == "" ||
    description == null
  ) {
    valid = false;
  }
  return valid;
}
function addTask() {
  $("#addTaskPage").show("slow");
}
function editTask(i) {
  let position = i;
  $("#addTaskPage").show("slow");
  $("#addTaskPage h3").text("Edit task");
  $("#addTaskPage #add").text("Update");
  $("#add").attr("id", "update");
  // TITLES, TYPES, PRIORITIES, ETTIQUETTES, _STATUS, _DATE, DESCRIPTIONS;
  $("#description").val(obj[position].DESCRIPTIONS);
  $("#taskTitle").val(obj[position].TITLES);
  $("#date").val(obj[position]._DATE);
  const type = obj[position].TYPES;
  const priority = obj[position].PRIORITIES;
  const ettiquette = obj[position].ETTIQUETTES;
  const status = obj[position]._STATUS;
  if (type == "feature") $("#feature").attr("checked", true);
  else $("#bug").attr("checked", true);
  $('option[value="' + priority + '"]').attr("selected", true);
  $('option[value="' + ettiquette + '"]').attr("selected", true);
  $('option[value="' + status + '"]').attr("selected", true);
  $("#update").click(function () {
    //let changes = getInputs();
    $("#form").attr("action", "assets/php/edit.php?ID=" + parseInt(position));
    reloadTasks();
  });
  return false;
}
function deleteTask(i) {
  Swal.fire({
    title: "Do you really want to delete this task?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `Not now`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        // Action
        url: "http://localhost/sb_v2/assets/php/delete.php",
        // Method
        data: { ID: i },
        success: function (response) {
          if (response == i) {
            Swal.fire("deleted!", "", "success");
            reloadTasks();
            //document.getElementById(id).style.display = "none";
          } else {
            Swal.fire(
              "An Error accurated while deleting this item",
              "",
              "info"
            );
          }
        },
      });
    }
  });
}

// reloadTasks();

$(document).ready(function () {
  //alert("hey");
  $("#addTask").click(function () {
    $("#addTaskPage").toggle("slow");
  });
  $("#cancel").click(function () {
    $("#addTaskPage").hide("slow");
    document.forms["form-task"].reset();
  });
  //   $("#add").click(function () {
  //     if ($(this).attr("id") == "update") {
  //       return; // to prevent adding node
  //     } else {
  //       let form = document.forms["form-task"];
  //       if (
  //         verifyInputs(
  //           form.taskTitle.value,
  //           form.date.value,
  //           form.description.value
  //         )
  //       ) {
  //         $("#addTaskPage").hide("slow");
  //         let task = {
  //           id: arrOfTask.length,
  //           title: form.taskTitle.value,
  //           type: form.feature.checked ? "feature" : "bug",
  //           priority: form.priorityField.value,
  //           ettiquette: form.bgField.value,
  //           status: form.statusField.value,
  //           date: form.date.value,
  //           description: form.description.value,
  //         };
  //         arrOfTask.push(task);
  //         localStorage.setItem("arrOfTasks", JSON.stringify(arrOfTask));
  //         window.location.reload();
  //       } else {
  //         $("#validation").text("Please fill all the fields!");
  //       }
  //     }
  //   });
});

function pushInDataBase() {}
