export const summarizeHandler = async (req, res) => {
  try {
    console.log("Logged in user:", req.user.email);

    const { text } = req.body;

    const summary = await openaiSummarize(text);

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//waste file