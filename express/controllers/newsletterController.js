function sendNewsletterEmail(req, res) {
  try {
    const { email } = req.body;

    console.info({
      from: "CloudGames Newsletter",
      to: email,
      subject: "Welcome to CloudGames Newsletter",
      text: "Thanks for subscribing to CloudGames!",
      html: "<p>Thanks for subscribing to <strong>CloudGames</strong>! 🎮</p>",
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default { sendNewsletterEmail };
