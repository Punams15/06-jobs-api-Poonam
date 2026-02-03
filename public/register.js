// register.js
import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showTrips } from "./trips.js"; // your trips page

let registerDiv = null;
let nameInput = null;
let emailInput = null;
let passwordInput = null;
let passwordVerify = null;

export const handleRegister = () => {
  registerDiv = document.getElementById("register-div");
  nameInput = document.getElementById("name");
  emailInput = document.getElementById("email1");
  passwordInput = document.getElementById("password1");
  passwordVerify = document.getElementById("password2");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");

  registerDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === registerButton) {
        // Check if passwords match
        if (passwordInput.value !== passwordVerify.value) {
          message.textContent = "Passwords do not match.";
          return;
        }

        enableInput(false);

        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: nameInput.value,
              email: emailInput.value,
              password: passwordInput.value,
            }),
          });

          const data = await response.json();

          if (response.status === 201) {
            message.textContent = `Registration successful. Welcome ${data.user.name}`;
            setToken(data.token);

            // Clear inputs
            nameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            passwordVerify.value = "";

            // Go to trips page
            showTrips();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.error(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === registerCancel) {
        // Clear inputs and go back
        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        passwordVerify.value = "";
        showLoginRegister();
      }
    }
  });
};

export const showRegister = () => {
  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
  passwordVerify.value = "";
  setDiv(registerDiv);
};
