export let notFoundPage = (req, res) => {
  return res.status(404).json({ message: "not found page " });
};
