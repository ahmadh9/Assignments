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
            <h6 class"card-subtitle mb-2 text-muted">${User.email}</h6>
            <p class card-text">
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
document.addEventListener("DOMContentLoaded", UI.displayUsers);

document.querySelector("#userForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const name = document.querySelector("#name").value;
  const phone = document.querySelector("#phone").value;
  const gender = document.querySelector("#gender").value;
  const address = document.querySelector("#address").value;

  const newUser = new User(email, name, phone, gender, address);
  usersArray.push(newUser);
  UI.addUserToList(newUser);
  UI.addUserCard(newUser);
  document.querySelector("#userForm").reset();
});
