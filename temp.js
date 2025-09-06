// API VIDEOGAMES
// - GET
// - GET :id
// - MODIFY

const videogames = {
  id: 10,
  name: "...",
  description: `...`,
  price: 59.99,
  promo_price: 19.89,
  developer: "...",
  release_date: "24-05-10",
  image_url: "...",
  quantity: 54,
  vote: 4.7,
  platforms: [
    "Nintendo Switch",
    "Xbox",
    // ...
  ],
  genres: [
    "Horror",
    // ...
  ],
  media: [
    {
      type: "img",
      url: "...",
    },
    {
      type: "video",
      url: "...",
    },
  ],
};

// API INVOICE
// - GET (index)
// - GET :id (show)
// - POST (store) : 200 OK

const invoices = {
  id: 10,
  total_amount: 2,
  currency: "EUR",
  status: "pending",
  payment_provider: null,
  created_at: "24-10-02",
  completed_at: null,
  videogames: [
    {
      id: 10,
      name: "...",
      description: `...`,
      price: 59.99,
      promo_price: 19.89,
      developer: "...",
      release_date: "24-05-10",
      image_url: "...",
      vote: 4.7,
      order_quantity: 54,
    },
  ],
  discount:
    {
      code: "ABCDEFGHIJKLMNOPQRST",
      discount_percentage: 10,
      expires_at: "24-10-05",
    } || null,
  billing_address:
    {
      id: 10,
      full_name: "Mario Rossi",
      address_line: "Via Sesso",
      city: "Reggio Emilia",
      postal_code: "ABC100OK",
      country: "IT",
      created_at: "24-10-05",
    } || null,
};

// API BILLING_ADDRESS
// - POST (store) : 200 OK
