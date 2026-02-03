// addEdit.js
import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showTrips } from "./trips.js";

let addEditDiv = null;
let destination = null;
let startDate = null;
let endDate = null;
let notes = null;
let submitButton = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-trip");
  destination = document.getElementById("destination");
  startDate = document.getElementById("start-date");
  endDate = document.getElementById("end-date");
  notes = document.getElementById("notes");
  submitButton = document.getElementById("submit-trip");
  const cancelButton = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === submitButton) {
      enableInput(false);

      let method = "POST";
      let url = "/api/v1/trips";

      if (submitButton.textContent === "update") {
        method = "PATCH";
        url = `/api/v1/trips/${addEditDiv.dataset.id}`;
      }

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            destination: destination.value,
            startDate: startDate.value,
            endDate: endDate.value,
            notes: notes.value,
          }),
        });

        const data = await response.json();

        if (response.status === 200 || response.status === 201) {
          message.textContent =
            response.status === 201
              ? "Trip successfully added."
              : "Trip successfully updated.";

          destination.value = "";
          startDate.value = "";
          endDate.value = "";
          notes.value = "";

          showTrips();
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        console.error(err);
        message.textContent = "A communication error occurred.";
      }

      enableInput(true);
    } else if (e.target === cancelButton) {
      message.textContent = "";
      showTrips();
    }
  });
};

export const showAddEdit = async (tripId) => {
  if (!tripId) {
    // Add new trip
    destination.value = "";
    startDate.value = "";
    endDate.value = "";
    notes.value = "";
    submitButton.textContent = "add";
    message.textContent = "";
    setDiv(addEditDiv);
  } else {
    // Edit existing trip
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/trips/${tripId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        destination.value = data.trip.destination;
        startDate.value = data.trip.startDate;
        endDate.value = data.trip.endDate;
        notes.value = data.trip.notes || "";
        submitButton.textContent = "update";
        addEditDiv.dataset.id = tripId;
        message.textContent = "";
        setDiv(addEditDiv);
      } else {
        message.textContent = "The trip entry was not found.";
        showTrips();
      }
    } catch (err) {
      console.error(err);
      message.textContent = "A communication error occurred.";
      showTrips();
    }

    enableInput(true);
  }
};
