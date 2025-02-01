var btn1 = document.getElementsByClassName("btn")[0];
var input1 = document.getElementById("num");
var formContainer = document.getElementsByClassName("hideme1")[0];
var form2 = document.getElementsByClassName("hideme2")[0];
var progressDiv = document.querySelector(".progress");
var bookForm = document.getElementById("bookForm");
var table = document.getElementsByClassName("hideme4")[0];

formContainer.classList.remove("hideme1");

var messg = document.getElementsByClassName("messg")[0];
var messgchar = document.getElementsByClassName("messg1")[0];
var messgnum = document.getElementsByClassName("messg2")[0];
var messg2 = document.getElementsByClassName("messg3")[0];
var messg4 = document.getElementsByClassName("messg4")[0];
var messgchar2 = document.getElementsByClassName("messg5")[0];
var messg6 = document.getElementsByClassName("messg6")[0];
var messgemail = document.getElementsByClassName("messg7")[0];

var totalBooks = 0;
var currentBook = 0;
var booksArray = [];

var bookTable = document
  .getElementById("book-table")
  .getElementsByTagName("tbody")[0];

function Book(name, price, author) {
  this.name = name;
  this.price = price;
  this.author = author;
}

function Author(name, email) {
  this.name = name;
  this.email = email;
}

function editRow(btn) {
  var row = btn.parentNode.parentNode;
  var cells = row.cells;
  var currentValues = {
    name: cells[0].textContent,
    price: cells[1].textContent,
    authorName: cells[2].textContent,
    authorEmail: cells[3].textContent,
  };

  cells[0].innerHTML = `<input type="text" value="${currentValues.name}" class="edit-input">`;
  cells[1].innerHTML = `<input type="text" value="${currentValues.price}" class="edit-input">`;
  cells[2].innerHTML = `<input type="text" value="${currentValues.authorName}" class="edit-input">`;
  cells[3].innerHTML = `<input type="text" value="${currentValues.authorEmail}" class="edit-input">`;

  btn.textContent = "Save";
  btn.onclick = function () {
    saveRow(this);
  };

  var editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach(function (button) {
    if (button !== btn) button.disabled = true;
  });
}

function saveRow(btn) {
  var row = btn.parentNode.parentNode;
  var cells = row.cells;
  var inputs = row.getElementsByClassName("edit-input");

  var updatedValues = {
    name: inputs[0].value.trim(),
    price: inputs[1].value.trim(),
    authorName: inputs[2].value.trim(),
    authorEmail: inputs[3].value.trim(),
  };

  if (updatedValues.name === "") {
    alert("Book name cannot be empty");
    return;
  }
  if (isNaN(updatedValues.price) || updatedValues.price === "") {
    alert("Price must be a number");
    return;
  }
  if (updatedValues.authorName === "") {
    alert("Author name cannot be empty");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedValues.authorEmail)) {
    alert("Please enter a valid email");
    return;
  }

  cells[0].textContent = updatedValues.name;
  cells[1].textContent = updatedValues.price;
  cells[2].textContent = updatedValues.authorName;
  cells[3].textContent = updatedValues.authorEmail;

  var index = Array.from(bookTable.rows).indexOf(row);
  booksArray[index].name = updatedValues.name;
  booksArray[index].price = updatedValues.price;
  booksArray[index].author.name = updatedValues.authorName;
  booksArray[index].author.email = updatedValues.authorEmail;

  btn.textContent = "Edit";
  btn.onclick = function () {
    editRow(this);
  };

  var editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach(function (button) {
    button.disabled = false;
  });
}

function deleteRow(btn) {
  if (confirm("Are you sure you want to delete this book?")) {
    var row = btn.parentNode.parentNode;
    var index = Array.from(bookTable.rows).indexOf(row);

    booksArray.splice(index, 1);
    row.remove();

    totalBooks--;
    currentBook--;

    if (booksArray.length === 0) {
      progressDiv.textContent = "All books have been deleted";
    } else {
      progressDiv.textContent = `${booksArray.length} books remaining`;
    }
  }
}

btn1.addEventListener("click", function () {
  totalBooks = parseInt(input1.value);
  if (totalBooks > 0) {
    formContainer.classList.add("hideme1");
    form2.classList.remove("hideme3");
    updateProgress();
  } else {
    alert("Please enter a valid number of books");
  }
});

function updateProgress() {
  progressDiv.textContent = `Adding book ${currentBook + 1} of ${totalBooks}`;
}

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  var bookNameInput = document.querySelectorAll("input")[1];
  var priceInput = document.querySelectorAll("input")[2];
  var authorNameInput = document.querySelectorAll("input")[3];
  var authorEmailInput = document.querySelectorAll("input")[4];

  var isValid = true;

  if (bookNameInput.value.trim() === "") {
    messg.classList.remove("messghide");
    isValid = false;
  }

  if (priceInput.value.trim() === "") {
    messg2.classList.remove("messghide1");
    isValid = false;
  }

  if (authorNameInput.value.trim() === "") {
    messg4.classList.remove("messghide2");
    isValid = false;
  }

  if (authorEmailInput.value.trim() === "") {
    messg6.classList.remove("messghide3");
    isValid = false;
  } else {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmailInput.value)) {
      messgemail.classList.remove("messghideemail");
      isValid = false;
    }
  }

  if (!isValid) {
    return;
  }

  var bookName = bookNameInput.value;
  var bookPrice = priceInput.value;
  var authorName = authorNameInput.value;
  var authorEmail = authorEmailInput.value;

  var author = new Author(authorName, authorEmail);
  var book = new Book(bookName, bookPrice, author);
  booksArray.push(book);

  var row = bookTable.insertRow();
  row.insertCell(0).textContent = book.name;
  row.insertCell(1).textContent = book.price;
  row.insertCell(2).textContent = book.author.name;
  row.insertCell(3).textContent = book.author.email;
  var actionCell = row.insertCell(4);
  actionCell.innerHTML = `
    <button class="edit-btn" onclick="editRow(this)">Edit</button>
    <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
  `;

  currentBook++;
  bookForm.reset();

  messg.classList.add("messghide");
  messgchar.classList.add("messghidechar");
  messg2.classList.add("messghide1");
  messgnum.classList.add("messghidenum");
  messg4.classList.add("messghide2");
  messgchar2.classList.add("messghidechar2");
  messg6.classList.add("messghide3");
  messgemail.classList.add("messghideemail");

  if (currentBook >= totalBooks) {
    form2.classList.add("hideme3");
    table.classList.remove("hideme5");
    progressDiv.textContent = "All books have been added!";
  } else {
    updateProgress();
  }
});
