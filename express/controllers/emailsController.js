import { MailtrapClient } from "mailtrap";

const mailtrapClient = new MailtrapClient({
  token: process.env.MAIL_IO_API_KEY,
});

async function sendNewsletterEmail(req, res) {
  try {
    const { email } = req.body;

    const sender = {
      name: "CloudGames Newsletter",
      email: "no-reply@demomailtrap.co",
    };

    await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      subject: "Benvenuti su CloudGames! 🎮",
      text: "Grazie di esserti iscritto alla newsletter di CloudGames! 🎮\n\nCome regalo di benvenuto, ecco uno sconto del 10% sul tuo prossimo acquisto con il codice WELCOME10.\n\nBuon divertimento!\nIl team di CloudGames",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Benvenuto su CloudGames</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
              <img src="cid:logo" alt="CloudGames" style="height: 60px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700;">Benvenuto su CloudGames!</h1>
              <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">La tua avventura gaming inizia qui 🎮</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <!-- Welcome Message -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 26px;">Grazie per esserti iscritto!</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">
                  Sei ora parte della community CloudGames! Riceverai le ultime novità sui giochi più interessanti, 
                  offerte esclusive e molto altro ancora.
                </p>
              </div>
              
              <!-- Welcome Gift -->
              <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px; color: white;">
                <div style="font-size: 48px; margin-bottom: 15px;">🎁</div>
                <h3 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 700;">Regalo di Benvenuto!</h3>
                <p style="margin: 0 0 20px 0; font-size: 16px; opacity: 0.9;">
                  Come regalo di benvenuto, ecco uno sconto speciale per te:
                </p>
                <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 20px; display: inline-block;">
                  <div style="font-size: 36px; font-weight: 700; margin-bottom: 5px;">10% OFF</div>
                  <div style="font-size: 18px; font-weight: 600; letter-spacing: 2px; background: rgba(255,255,255,0.9); color: #4caf50; padding: 8px 16px; border-radius: 6px; display: inline-block;">
                    WELCOME10
                  </div>
                </div>
                <p style="margin: 20px 0 0 0; font-size: 14px; opacity: 0.8;">
                  Usa questo codice al checkout per ottenere il tuo sconto!
                </p>
              </div>
              
              <!-- Features -->
              <div style="margin-bottom: 30px;">
                <h3 style="color: #333; text-align: center; margin: 0 0 25px 0; font-size: 22px;">Cosa puoi aspettarti:</h3>
                <div style="display: grid; gap: 20px;">
                  <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="background: #667eea; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">🎮</div>
                    <div>
                      <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">Novità sui Giochi</h4>
                      <p style="margin: 0; color: #666; font-size: 14px;">Le ultime uscite e anteprime esclusive</p>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="background: #4caf50; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">💰</div>
                    <div>
                      <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">Offerte Esclusive</h4>
                      <p style="margin: 0; color: #666; font-size: 14px;">Sconti speciali solo per gli iscritti</p>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="background: #ff9800; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">⭐</div>
                    <div>
                      <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">Recensioni e Consigli</h4>
                      <p style="margin: 0; color: #666; font-size: 14px;">I nostri esperti ti consigliano i migliori giochi</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Footer Message -->
              <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px;">
                <p style="margin: 0 0 10px 0; color: #333; font-size: 18px; font-weight: 600;">Inizia subito la tua avventura!</p>
                <p style="margin: 0 0 20px 0; color: #666; font-size: 16px;">Esplora il nostro catalogo di giochi e trova il tuo prossimo preferito.</p>
                <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: 600; display: inline-block; transition: transform 0.2s;">
                  Scopri i Giochi
                </a>
                <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">
                  Il team di <strong>CloudGames</strong> ❤️
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      category: "newsletter",
      attachments: [
        {
          filename: "logo_navbar1.png",
          path: "./public/logo_navbar1.png",
          content_id: "logo",
          disposition: "inline",
        },
      ],
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    const status =
      error.status || error.cause?.status || error.cause?.response?.status;

    if (status === 403) {
      return res.status(400).json({ error: "Indirizzo email non valido" });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function sendOrderEmail(req, res) {
  try {
    const { email, invoice_id, billing_address_id } = req.body;

    const [orderDetails, billingAddress] = await Promise.all([
      fetch(`http://localhost:3000/invoices/${invoice_id}`).then((res) =>
        res.json()
      ),
      fetch(
        `http://localhost:3000/billing-addresses/${billing_address_id}`
      ).then((res) => res.json()),
    ]);

    if (!orderDetails || !billingAddress) {
      return res.status(400).json({ error: "Invalid invoice or address ID" });
    }

    const sender = {
      name: "CloudGames Orders",
      email: "no-reply@demomailtrap.co",
    };

    // Create formatted videogames list
    const videogamesListHtml = orderDetails.videogames
      .map(
        (game) => `
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 16px; padding: 16px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${game.image_url}" alt="${
          game.name
        }" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 18px; font-weight: 600;">${
              game.name
            }</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Sviluppatore: ${
              game.developer
            }</p>
            <div style="display: flex; align-items: center; gap: 16px; margin-top: 8px;">
              <span style="color: #333; font-weight: 600;">Quantità: ${
                game.order_quantity
              }</span>
              <span style="color: #333; font-weight: 600;">
                Prezzo: €${
                  game.promo_price
                    ? game.promo_price.toFixed(2)
                    : game.price.toFixed(2)
                }
                ${
                  game.promo_price
                    ? `<span style="text-decoration: line-through; color: #999; font-weight: normal; margin-left: 8px;">€${game.price.toFixed(
                        2
                      )}</span>`
                    : ""
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    const discountHtml = orderDetails.discount
      ? `
      <div style="background: #e8f5e8; border: 1px solid #4caf50; border-radius: 6px; padding: 12px; margin: 16px 0;">
        <p style="margin: 0; color: #2e7d32; font-weight: 600;">
          🎉 Sconto applicato: ${orderDetails.discount.code} (-${orderDetails.discount.discount_percentage}%)
        </p>
      </div>
    `
      : "";

    await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      subject: "Conferma del tuo ordine su CloudGames",
      text: `Ciao ${
        billingAddress.full_name
      }!\n\nGrazie per il tuo ordine su CloudGames! 🎮\n\nOrdine #${
        orderDetails.id
      }\nTotale: €${orderDetails.total_amount.toFixed(2)}\nStato: ${
        orderDetails.status
      }\n\nGiochi acquistati:\n${orderDetails.videogames
        .map(
          (game) =>
            `- ${game.name} (x${game.order_quantity}) - €${
              game.promo_price
                ? game.promo_price.toFixed(2)
                : game.price.toFixed(2)
            }`
        )
        .join("\n")}\n\nIndirizzo di fatturazione:\n${
        billingAddress.full_name
      }\n${billingAddress.address_line}\n${billingAddress.city}, ${
        billingAddress.postal_code
      }\n${billingAddress.country}\n\nIl team di CloudGames`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Conferma Ordine CloudGames</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
              <img src="cid:logo" alt="CloudGames" style="height: 50px; margin-bottom: 15px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Grazie per il tuo ordine!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Il tuo acquisto è stato confermato 🎮</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <!-- Greeting -->
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Ciao ${
                billingAddress.full_name
              }!</h2>
              
              <!-- Order Summary -->
              <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Riepilogo Ordine</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #666;">Numero Ordine:</span>
                  <span style="font-weight: 600; color: #333;">#${
                    orderDetails.id
                  }</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #666;">Data:</span>
                  <span style="color: #333;">${new Date(
                    orderDetails.created_at
                  ).toLocaleDateString("it-IT")}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #666;">Stato:</span>
                  <span style="color: #333; text-transform: capitalize;">${
                    orderDetails.status
                  }</span>
                </div>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 15px 0;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #333; font-size: 18px; font-weight: 600;">Totale:</span>
                  <span style="color: #667eea; font-size: 20px; font-weight: 700;">€${orderDetails.total_amount.toFixed(
                    2
                  )}</span>
                </div>
              </div>

              ${discountHtml}
              
              <!-- Games List -->
              <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">I tuoi giochi</h3>
              <div style="margin-bottom: 25px;">
                ${videogamesListHtml}
              </div>
              
              <!-- Billing Address -->
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Indirizzo di Fatturazione</h3>
              <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0 0 5px 0; color: #333; font-weight: 600;">${
                  billingAddress.full_name
                }</p>
                <p style="margin: 0 0 5px 0; color: #666;">${
                  billingAddress.address_line
                }</p>
                <p style="margin: 0; color: #666;">${billingAddress.city}, ${
        billingAddress.postal_code
      }</p>
                <p style="margin: 5px 0 0 0; color: #666;">${
                  billingAddress.country
                }</p>
              </div>
              
              <!-- Footer Message -->
              <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; color: #333; font-size: 16px;">Buon divertimento con i tuoi nuovi giochi!</p>
                <p style="margin: 0; color: #666; font-size: 14px;">Il team di <strong>CloudGames</strong></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      category: "order_confirmation",
      attachments: [
        {
          filename: "logo_navbar1.png",
          path: "./public/logo_navbar1.png",
          content_id: "logo",
          disposition: "inline",
        },
      ],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default { sendNewsletterEmail, sendOrderEmail };
