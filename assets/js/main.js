var arrOfTask;

function gettingDataFromDB() {
  console.log("hey");
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost/sb_v2/assets/php/getting_data.php", true);
  xhr.onreadystatechange = () => {
    if (xhr.status === 200 && xhr.readyState === XMLHttpRequest.DONE) {
      arrOfTask = JSON.parse(xhr.responseText);
      console.log(arrOfTask);
    }
  };

  xhr.send();
}

// const res = localStorage.getItem("arrOfTasks");
// if (res == undefined) {
//   localStorage.setItem("arrOfTasks", JSON.stringify(arrOfTasks));
//   setTimeout(() => {
//     window.location.reload();
//   }, 1000);
// } else {
//   arrOfTask = JSON.parse(localStorage.getItem("arrOfTasks") || "[]");
// }

function reloadTasks() {
  gettingDataFromDB();
  console.log(arrOfTask.length());
  document.getElementById("to-do-parent").innerHTML = "";
  document.getElementById("doing-parent").innerHTML = "";
  document.getElementById("done-parent").innerHTML = "";
  let parent;
  let to_do_counter = 0,
    doing_counter = 0,
    done_counter = 0;

  arrOfTask.forEach((task) => {
    let icon;
    if (task._STATUS == "To Do") {
      parent = "to-do-parent";
      to_do_counter++;
      icon = "icon-wait.png";
    } else if (task._STATUS == "In Progress") {
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
    <div class="task pb-2" id="task_${task.ID}" >
      <div class="card-task p-2" style="background-color: var(--card-color);">
        <div class="d-flex" id="task-info">
          <div  class="d-flex justify-content-center align-middle p-2"><img src="./assets/img/${icon}" style="width: 25px;height: 25px;" alt="icon-wait"></div>
            <div class="flex-fill p-2">
              <h6 style="width:85%;">${task.TITLES}</h6>
              <p  class="mb-1">#1 Assigned at ${task._DATE}</p>
              <p class="mb-1">${task.DESCRIPTIONS}</p>
            </div>
            <button class="edit bg-transparent"><i class="bi bi-pencil-square"></i></button>
            <button class="delete bg-transparent"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="d-flex justify-content-end pe-2">
            <button class="px-4" id="type" style="background-color: var(--main-color) ; color: var(--secondary); border:none;  margin-left:5px;border-radius: 10px;" >${task.TYPES}</button>
            <button class="bg-transparent px-4" id="priority" style="border: 2px var(--main-color) solid; margin-left:5px;border-radius: 10px; color:var(--main-color) ;">${task.PRIORITIES}</button>
          </div>  
      </div>
    </div>
    `;
    document.getElementById(parent).innerHTML += template;
  });
  document.getElementById("to-do-counter").innerText = to_do_counter;
  document.getElementById("doing-counter").innerText = doing_counter;
  document.getElementById("done-counter").innerText = done_counter;
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
$(document).ready(function () {
  $("#addTask").click(function () {
    $("#addTaskPage").toggle("slow");
  });
  $("#cancel").click(function () {
    $("#addTaskPage").hide("slow");
    document.forms["form-task"].reset();
  });
  $(".delete").click(function () {
    var id_to_be_deleted = $(this)
      .parent()
      .parent()
      .parent()
      .attr("id")
      .split("_")[1];
    const pos = arrOfTask.map((t) => t.id).indexOf(parseInt(id_to_be_deleted));
    arrOfTask.splice(pos, 1);
    localStorage.setItem("arrOfTasks", JSON.stringify(arrOfTask));
    window.location.reload();
  });
  $(".edit").click(function () {
    var id_to_be_updated = $(this)
      .parent()
      .parent()
      .parent()
      .attr("id")
      .split("_")[1];
    const position = arrOfTask
      .map((t) => t.id)
      .indexOf(parseInt(id_to_be_updated));
    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", "assets/php/edit.php?ID=" + 15, true);
    // xhr.send();
    alert(position + 1);
    $("#form").attr("action", "assets/php/edit.php?ID=" + position + 1);
    $("#addTaskPage").show("slow");
    $("#addTaskPage h3").text("Edit task");
    $("#addTaskPage #add").text("Update");
    $("#add").attr("id", "update");
    $("#description").val(arrOfTask[position].description);
    $("#taskTitle").val(arrOfTask[position].title);
    $("#date").val(arrOfTask[position].date);
    const type = arrOfTask[position].type;
    const priority = arrOfTask[position].priority;
    const ettiquette = arrOfTask[position].ettiquette;
    const status = arrOfTask[position].status;
    if (type == "feature") $("#feature").attr("checked", true);
    else $("#bug").attr("checked", true);
    $('option[value="' + priority + '"]').attr("selected", true);
    $('option[value="' + ettiquette + '"]').attr("selected", true);
    $('option[value="' + status + '"]').attr("selected", true);
    $("#update").click(function () {
      //let changes = getInputs();
      let form = document.forms["form-task"];
      let updatedNode = {
        id: position,
        title: form.taskTitle.value,
        type: form.feature.checked ? "feature" : "bug",
        priority: form.priorityField.value,
        ettiquette: form.bgField.value,
        status: form.statusField.value,
        date: form.date.value,
        description: form.description.value,
      };
      if (
        verifyInputs(
          form.taskTitle.value,
          form.date.value,
          form.description.value
        )
      ) {
        arrOfTask.splice(position, 1, updatedNode); /// remplace object in position with updated node
        localStorage.setItem("arrOfTasks", JSON.stringify(arrOfTask));
        window.location.reload();
      } else {
        $("#validation").text("invalid values or empty field detected !");
      }
    });
    return false;
  });

  $("#add").click(function () {
    if ($(this).attr("id") == "update") {
      return; // to prevent adding node
    } else {
      let form = document.forms["form-task"];
      if (
        verifyInputs(
          form.taskTitle.value,
          form.date.value,
          form.description.value
        )
      ) {
        $("#addTaskPage").hide("slow");
        let task = {
          id: arrOfTask.length,
          title: form.taskTitle.value,
          type: form.feature.checked ? "feature" : "bug",
          priority: form.priorityField.value,
          ettiquette: form.bgField.value,
          status: form.statusField.value,
          date: form.date.value,
          description: form.description.value,
        };
        arrOfTask.push(task);
        localStorage.setItem("arrOfTasks", JSON.stringify(arrOfTask));
        window.location.reload();
      } else {
        $("#validation").text("Please fill all the fields!");
      }
    }
  });
});

function pushInDataBase() {}
