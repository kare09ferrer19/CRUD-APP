  var firebaseConfig = {
    apiKey: "AIzaSyDbgkGf6hGEOBGFQ1Gbi2Ju50IFs0UHa3A",
    authDomain: "marepruebafirebase.firebaseapp.com",
    databaseURL: "https://marepruebafirebase.firebaseio.com",
    projectId: "marepruebafirebase",
    storageBucket: "marepruebafirebase.appspot.com",
    messagingSenderId: "207521848347",
    appId: "1:207521848347:web:036ee58610538ecfdbecbe",
    measurementId: "G-F3S54NDCJK"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
// Referencia de la base de datos de Firebase y el hijo
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');
  readUserData(); 

// READ-LEER
function readUserData() {
  const userListUI = document.getElementById("user-list");
  usersRef.on("value", snap => {
    userListUI.innerHTML = ""
    snap.forEach(childSnap => {
      let key = childSnap.key,
        value = childSnap.val()
      let $li = document.createElement("li");
      // icono de edición
      let editIconUI = document.createElement("span");
      editIconUI.class = "edit-user";
      editIconUI.innerHTML = " ✎";
      editIconUI.setAttribute("userid", key);
      editIconUI.addEventListener("click", editButtonClicked)

      // icono de eliminar
      let deleteIconUI = document.createElement("span");
      deleteIconUI.class = "delete-user";
      deleteIconUI.innerHTML = " ☓";
      deleteIconUI.setAttribute("userid", key);
      deleteIconUI.addEventListener("click", deleteButtonClicked)
      
      $li.innerHTML = value.Nombre;
      $li.append(editIconUI);
      $li.append(deleteIconUI);

      $li.setAttribute("user-key", key);
      $li.addEventListener("click", userClicked)
      userListUI.append($li);
    });
  })
}

function userClicked(e) {
    var userID = e.target.getAttribute("user-key");

    const userRef = dbRef.child('users/' + userID);
    const userDetailUI = document.getElementById("user-detail");
    userRef.on("value", snap => {
      userDetailUI.innerHTML = ""
      snap.forEach(childSnap => {
        var $p = document.createElement("p");
        $p.innerHTML = childSnap.key  + " - " +  childSnap.val();
        userDetailUI.append($p);
      })
    });
}


// CREATE-AÑADIR
const addUserBtnUI = document.getElementById("add-user-btn");
addUserBtnUI.addEventListener("click", addUserBtnClicked)
function addUserBtnClicked() {

  const usersRef = dbRef.child('users');
  const addUserInputsUI = document.getElementsByClassName("user-input");
  // este objeto contendrá la nueva información del usuario
    let newUser = {};
    // recorrer la vista para obtener los datos del modelo
    for (let i = 0, len = addUserInputsUI.length; i < len; i++) {
        let key = addUserInputsUI[i].getAttribute('data-key');
        let value = addUserInputsUI[i].value;
        newUser[key] = value;
    }
  usersRef.push(newUser)
}


// DELETE-ELIMINAR
function deleteButtonClicked(e) {
    e.stopPropagation();
    var userID = e.target.getAttribute("userid");
    const userRef = dbRef.child('users/' + userID);
    userRef.remove();

}

// UPDATE-EDITAR O ACTUALIZAR
function editButtonClicked(e) {
  document.getElementById('edit-user-module').style.display = "block";
  //establecer la identificación del usuario en el campo de entrada oculto
  document.querySelector(".edit-userid").value = e.target.getAttribute("userid");
  const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));
  // establecer datos en el campo de usuario
  const editUserInputsUI = document.querySelectorAll(".edit-user-input");

  userRef.on("value", snap => {
    for(var i = 0, len = editUserInputsUI.length; i < len; i++) {
      var key = editUserInputsUI[i].getAttribute("data-key");
          editUserInputsUI[i].value = snap.val()[key];
    }

  });

  const saveBtn = document.querySelector("#edit-user-btn");
  saveBtn.addEventListener("click", saveUserBtnClicked)
}

function saveUserBtnClicked(e) {
  const userID = document.querySelector(".edit-userid").value;
  const userRef = dbRef.child('users/' + userID);
  var editedUserObject = {}
  const editUserInputsUI = document.querySelectorAll(".edit-user-input");
  editUserInputsUI.forEach(function(textField) {
    let key = textField.getAttribute("data-key");
    let value = textField.value;
      editedUserObject[textField.getAttribute("data-key")] = textField.value
  });

  userRef.update(editedUserObject);
  document.getElementById('edit-user-module').style.display = "none";
}
