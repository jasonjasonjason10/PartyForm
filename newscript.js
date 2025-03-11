const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2502-FTB-ET-WEB-FT/events`;

const state = {
  events: [],
};

// getting events from the API
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch events");

    const json = await response.json();
    state.events = json.data;
    console.log("Fetched events:", json); // Debugging log

    renderEvents();
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

// Rendering the events from the API to the browser page
function renderEvents() {
  const eventList = document.querySelector("#parties");
  eventList.innerHTML = "";

  if (!state.events.length) {
    eventList.innerHTML = "<li> No events.</li>";
    return;
  }

  const eventCards = state.events.map((party) => {
    const card = document.createElement("li");
    card.innerHTML = `
        <h2>${party.name}</h2>
        <h6>${party.location}</h6>
        <p>${party.date}</p>
        <p>${party.description}</p>
        <button class="delete-btn" data-id="${party.id}">Delete</button> `;

    card.querySelector(".delete-btn").addEventListener("click", async () => {
      await deleteEvent(party.id);
    });

    return card;
  });

  eventList.replaceChildren(...eventCards);
}

// Adding a new Event
async function addParty(partyData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partyData),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.error.message);
    }

    console.log("Party added:", json); // Debugging log
    await getEvents();
  } catch (error) {
    console.error("Error adding party:", error);
  }
}

// Deleting an Event
async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete party");

    await getEvents(); // Refresh event list after deletion
  } catch (error) {
    console.error("Error deleting party:", error);
  }
}

document.querySelector("#addParty").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.target;
  const dateInput = form.date.value;
  if (!dateInput) {
    console.error("Invalid Date");
    return;
  }
  const formattedDate = new Date(dateInput).toISOString();

  const partyData = {
    name: form.name.value,
    location: form.location.value,
    date: formattedDate,
    description: form.description.value,
  };

  console.log("Submitting partyData:", partyData); // Debugging log
  await addParty(partyData);
  form.reset();
});

// Renders
async function render() {
  await getEvents();
}

document.addEventListener("DOMContentLoaded", () => {
  render();
});

