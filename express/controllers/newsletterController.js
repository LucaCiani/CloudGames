import { MailtrapClient } from "mailtrap";

async function sendNewsletterEmail(req, res) {
  try {
    const { email } = req.body;

    const token = process.env.MAIL_IO_API_KEY;
    if (!token) {
      return res.status(500).json({ error: "Mailtrap token not configured" });
    }

    const mailtrapClient = new MailtrapClient({ token });

    const sender = {
      name: "CloudGames Newsletter",
      email: "no-reply@demomailtrap.co",
    };

    await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      subject: "Benvenuti su CloudGames!",
      text: "Grazie di esserti iscritto alla newsletter di CloudGames! 🎮\n\nCome regalo di benvenuto, ecco uno sconto del 10% sul tuo prossimo acquisto con il codice WELCOME10.\n\nBuon divertimento!\nIl team di CloudGames",
      html: `<p>Grazie di esserti iscritto alla newsletter di <b>CloudGames</b>! 🎮</p> 
      <p>Come regalo di benvenuto, ecco uno sconto del <b>10%</b> sul tuo prossimo acquisto con il codice <b>WELCOME10</b>.</p>
      <p>Buon divertimento!<br/>Il team di CloudGames</p>`,
      category: "newsletter",
    });

    return res
      .status(200)
      .json({ ok: true, message: "Subscription successful" });
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

export default { sendNewsletterEmail };
