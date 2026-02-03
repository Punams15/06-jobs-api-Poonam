// trips.js
import { inputEnabled, setDiv, message, enableInput, token, setToken } from "./index.js";
import { showAddEdit } from "./addEdit.js";
import { showLoginRegister } from "./loginRegister.js";

let tripsDiv = null;
let tripsTable = null;
let tripsTableHeader = null;

export const handleTrips = () => {
  tripsDiv = document.getElementById("trips");
  const logoff = document.getElementById("logoff");
  const addTrip = document.getElementById("add-trip");
  tripsTable = document.getElementById("trips-table");
  tripsTableHeader = document.getElementById("trips-table-header");

  tripsDiv.addEventListener("click", async (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === addTrip) {
      showAddEdit(null);
    } else if (e.target === logoff) {
      setToken(null);
      message.textContent = "You have been logged off.";
      tripsTable.replaceChildren(tripsTableHeader);
      showLoginRegister();
    } else if (e.target.classList.contains("editButton")) {
      message.textContent = "";
      showAddEdit(e.target.dataset.id);
    } else if (e.target.classList.contains("deleteButton")) {
      const tripId = e.target.dataset.id;
      enableInput(false);
      try {
        const response = await fetch(`/api/v1/trips/${tripId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.status === 200) {
          message.textContent = "Trip entry deleted.";
          showTrips(); // refresh list
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        console.error(err);
        message.textContent = "A communication error occurred.";
      }
      enableInput(true);
    }
  });
};

export const showTrips = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/trips", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [tripsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        tripsTable.replaceChildren(...children);
      } else {
        for (let i = 0; i < data.trips.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.trips[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.trips[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.trips[i].destination}</td>
            <td>${data.trips[i].startDate}</td>
            <td>${data.trips[i].endDate}</td>
            <td>${data.trips[i].notes || ""}</td>
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        tripsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
  setDiv(tripsDiv);
};
