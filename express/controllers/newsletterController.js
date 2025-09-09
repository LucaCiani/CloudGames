import nodemailer from "nodemailer";

async function sendNewsletterEmail(req, res) {
  try {
    const { email } = req.body;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    // Support either SMTP_SECURE (true/false) or SMTP_SECURITY (values like SSL, STARTTLS)
    const secureEnv = (
      process.env.SMTP_SECURE ??
      process.env.SMTP_SECURITY ??
      ""
    )
      .toString()
      .toLowerCase();
    // secure true only for implicit SSL (usually port 465)
    const secure =
      port === 465 ||
      secureEnv === "true" ||
      secureEnv === "1" ||
      secureEnv === "ssl";
    // STARTTLS/TLS means upgrade on connect -> keep secure:false and optionally require TLS
    const requireTLS = secureEnv === "starttls" || secureEnv === "tls";

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure, // false for STARTTLS on 587, true only for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      ...(requireTLS ? { requireTLS: true } : {}),
    });

    const info = await transporter.sendMail({
      from: "CloudGames Newsletter <no-reply@cloudgames.test>",
      to: email,
      subject: "Benvenuti su CloudGames!",
      text: "Grazie di esserti iscritto alla newsletter di CloudGames! 🎮\n\nCome regalo di benvenuto, ecco uno sconto del 10% sul tuo prossimo acquisto con il codice WELCOME10.\n\nBuon divertimento!\nIl team di CloudGames",
      html: `<p>Grazie di esserti iscritto alla newsletter di <b>CloudGames</b>! 🎮</p> 
      <p>Come regalo di benvenuto, ecco uno sconto del <b>10%</b> sul tuo prossimo acquisto con il codice <b>WELCOME10</b>.</p>
      <p>Buon divertimento!<br/>Il team di CloudGames</p>`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    return res
      .status(200)
      .json({ ok: true, messageId: info.messageId, previewUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default { sendNewsletterEmail };
