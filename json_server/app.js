var courseApi = "http://localhost:3000/courses";

function start() {
  getCourses(renderCourses);
  handleCreateForm();
}

start();

function getCourses(callback) {
  fetch(courseApi)
    .then((response) => response.json())
    .then(callback);
}

function createCourse(data, callback) {
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), //Chuyển sang json
  };
  fetch(courseApi, options)
    .then((response) => response.json())
    .then(callback);
}

function handleDeleteCourse(id) {
  var options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(courseApi + "/" + id, options)
    .then((response) => response.json())
    .then(function () {
      var courseItem = document.querySelector(".course-item-" + id);
      if (courseItem) {
        courseItem.remove();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function renderCourses(courses) {
  var listCourse = document.getElementById("list-course");
  var html = courses.map((course) => {
    return `<li class="course-item-${course.id}">
            <h4>${course.name}</h4>
            <p>${course.description}</p>
            <button onclick='handleDeleteCourse("${course.id}")'>Xóa</button>
        </li>`;
  });
  listCourse.innerHTML = html.join(""); // Sử dụng join để nối các phần tử trong mảng thành chuỗi HTML
}

function handleCreateForm() {
  var createBtn = document.getElementById("create");
  createBtn.onclick = function () {
    var name = document.querySelector('input[name="name"]').value;
    var description = document.querySelector('input[name="description"]').value;
    var formData = {
      name: name,
      description: description,
    };
    createCourse(formData, function () {
      getCourses(renderCourses);
    });
  };
}
