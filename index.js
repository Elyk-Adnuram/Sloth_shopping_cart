import "dotenv/config.js";
//importing functions from firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

//importing dotenv
import dotenv from "dotenv";
dotenv.config();

//database url
const appSettings = {
  databaseURL: process.env.DATABASEURL,
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

//event listener to add items
addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  // pushing items to database
  push(shoppingListInDB, inputValue);

  clearInputFieldEl();
});
//onValue function enables a snapshot of database to be taken. with a snapshot one can check if there are any items in the database
onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items added yet";
  }
});

//set shopping list to an empty string
function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}
//clear the input field after item has been added
function clearInputFieldEl() {
  inputFieldEl.value = "";
}
//add additional item to shopping list.
function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
