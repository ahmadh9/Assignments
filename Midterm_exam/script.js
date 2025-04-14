class User {
  constructor(email, name, phone, gender, address) {
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.gender = gender;
    this.address = address;
  }
}

class UI {
  static addUserToList(User) {
    const list = document.querySelector("#user-list");

    const row = document.createElement("tr");
    row.innerHTML = `
     <td>${User.email}</td> 
        <td>${User.name}</td>
        <td>${User.phone}</td>
        <td>${User.gender}</td>
        <td>${User.address}</td>  `;
    list.appendChild(row);
  }

  static addUserCard(User) {
    const container = document.querySelector("#user-cards");

    const cards = document.createElement("div");
    cards.className = "col-md-4 mb-3";

    cards.innerHTML = `
            <div class="card shadow-sm">
            <div class="card-body">
            <h5 class="card-title">${User.name}</h5>
            <h6 class= "card-subtitle mb-2 text-muted">${User.email}</h6>
            <p class="card-text">
            <strong> phone: </strong> ${User.phone}<br>
            <strong> Gender: </strong> ${User.gender}<br>
            <strong> Address: </strong> ${User.address}<br>
            </p>
            </div>
            </div>

            `;
    container.appendChild(cards);
  }
}

let usersArray = [];
const errorElemnt = document.getElementById("error");
const successMessage = document.getElementById("successMessage");

document.querySelector("#userForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const name = document.querySelector("#name").value;
  const phone = document.querySelector("#phone").value;
  const gender = document.querySelector("#gender").value;
  const address = document.querySelector("#address").value;

  let messages = [];

  if (!email.includes("@") || !email.includes(".")) {
    messages.push("Email is invalid!");
  }

  if (name.length === 0) {
    messages.push("Please enter a valid name!");
  }

  let letters = true;
  for (let i = 0; i < name.length; i++) {
    let ch = name[i];
    if (!(ch >= "A" && ch <= "Z") && !(ch >= "a" && ch <= "z")) {
      letters = false;
    }
  }
  if (!letters) {
    messages.push("Name must contain letters only!");
  }

  if (phone.length < 10) {
    messages.push("Phone number should be at least 10 digits!");
  }

  let digits = true;
  for (let i = 0; i < phone.length; i++) {
    if (phone[i] < "0" || phone[i] > "9") {
      digits = false;
      break;
    }
  }
  if (!digits) {
    messages.push("Phone should contain numbers only!");
  }

  if (gender === "") {
    messages.push("Please select a gender!");
  }

  if (address === "") {
    messages.push("Address cannot be empty!");
  }

  if (messages.length > 0) {
    errorElemnt.classList.remove("d-none");
    errorElemnt.innerText = "Please fix the following:\n" + messages.join("\n");
    return;
  }

  const newUser = new User(email, name, phone, gender, address);

  usersArray.push(newUser);
  UI.addUserToList(newUser);
  UI.addUserCard(newUser);
  const list = successMessage.classList;
  list.remove("d-none");

  setTimeout(() => {
    successMessage.classList.add("d-none");
  }, 3000);

  errorElemnt.classList.add("d-none");

  document.querySelector("#userForm").reset();
});
