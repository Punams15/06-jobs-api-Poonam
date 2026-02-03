// index.js
// This module controls active div, token, and initialization

let activeDiv = null; // current visible div
export const setDiv = (newDiv) => {
  if (newDiv !== activeDiv) {
    if (activeDiv) activeDiv.style.display = "none";
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
  }
};

export let message = null;

// Import other modules
import { showTrips, handleTrips } from "./trips.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";

// Initialize once DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token"); // restore token if exists
  message = document.getElementById("message");

  // Initialize all modules
  handleLoginRegister();
  handleLogin();
  handleTrips();       // previously jobs.js is now trips.js
  handleRegister();
  handleAddEdit();

  // Show appropriate div
  if (token) {
    showTrips();
  } else {
    showLoginRegister();
  }
});
