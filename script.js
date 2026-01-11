const bookingForm = document.getElementById("bookingForm");
const resultEl = document.getElementById("result");
const recentEl = document.getElementById("recentSearches");

function loadRecent() {
  const raw = localStorage.getItem("recentSearches");
  if (!raw) {
    recentEl.innerHTML = "";
    return;
  }

  const items = JSON.parse(raw);
  if (!items.length) {
    recentEl.innerHTML = "";
    return;
  }

  const pills = items
    .map(
      (i) =>
        `<span class="recent-pill">${i.fromCity} → ${i.toCity} · ${i.travellers} · ${i.travelClass}</span>`
    )
    .join("");

  recentEl.innerHTML = `
    <div class="recent-title">Recent searches</div>
    <div class="recent-list">${pills}</div>
  `;
}

function saveRecent(entry) {
  const raw = localStorage.getItem("recentSearches");
  let items = raw ? JSON.parse(raw) : [];
  items.unshift(entry);
  items = items.slice(0, 4);
  localStorage.setItem("recentSearches", JSON.stringify(items));
}

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fromCity = document.getElementById("fromCity").value.trim();
  const toCity = document.getElementById("toCity").value.trim();
  const departDate = document.getElementById("departDate").value;
  const returnDate = document.getElementById("returnDate").value;
  const travellers = document.getElementById("travellers").value;
  const travelClass = document.getElementById("travelClass").value;

  if (!fromCity || !toCity || !departDate) {
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromCity,
        toCity,
        departDate,
        returnDate,
        travellers,
        travelClass,
      }),
    });

    const data = await res.json();
    const totalPrice = data.price;
    const { itinerary, breakdown } = data;

    resultEl.innerHTML = `
      <div class="result-card">
        <div class="result-left">
          <div class="result-main">
            ${itinerary.fromCity} → ${itinerary.toCity} · ${
      itinerary.travelClass.charAt(0).toUpperCase() +
      itinerary.travelClass.slice(1)
    }
          </div>
          <div class="result-meta">
            ${itinerary.departDate}${
      itinerary.returnDate ? " - " + itinerary.returnDate : ""
    } · ${breakdown.travellers} ${
      breakdown.travellers > 1 ? "Travellers" : "Traveller"
    }
          </div>
        </div>
        <div class="result-right">
          <div class="result-price">₹${totalPrice.toLocaleString("en-IN")}</div>
          <div class="result-tag">Includes taxes & fees</div>
        </div>
      </div>
    `;

    saveRecent({ fromCity, toCity, travellers, travelClass });
    loadRecent();
  } catch (err) {
    console.error(err);
    resultEl.innerHTML =
      '<div class="result-card"><div class="result-main">Something went wrong. Please try again.</div></div>';
  }
});

loadRecent();

