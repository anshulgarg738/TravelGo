const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/book", (req, res) => {
  const {
    fromCity,
    toCity,
    departDate,
    returnDate,
    travellers,
    travelClass,
  } = req.body;

  const numTravellers = Number(travellers) || 1;

  // Simple fake pricing logic
  const baseFare = 3500;
  const distanceFactor =
    (fromCity?.length || 3) * (toCity?.length || 3) * 10;
  let classMultiplier = 1;

  if (travelClass === "premium") classMultiplier = 1.3;
  if (travelClass === "business") classMultiplier = 1.8;

  const perTraveller = Math.round(
    (baseFare + distanceFactor) * classMultiplier
  );
  const total = perTraveller * numTravellers;
  const taxes = Math.round(total * 0.18);

  const response = {
    message: `Flight search from ${fromCity} to ${toCity} is available.`,
    price: total + taxes,
    breakdown: {
      baseFare: baseFare * numTravellers,
      distanceComponent: distanceFactor * numTravellers,
      perTraveller,
      travellers: numTravellers,
      taxes,
    },
    itinerary: {
      fromCity,
      toCity,
      departDate,
      returnDate: returnDate || null,
      travelClass,
    },
  };

  res.json(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
