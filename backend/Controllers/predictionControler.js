export const predictDiabetes = (req, res) => {
  res.json({ prediction: [0] });
};

export const predictCancer = (req, res) => {
  res.json({ prediction: [0] });
};

export const predictHeart = (req, res) => {
  res.json({ prediction: [0] });
};

export const predictKidney = (req, res) => {
  res.json({ prediction: [0] });
};

export const predictLiver = (req, res) => {
  res.json({ prediction: [0] });
};

export const predictMalaria = (req, res) => {
  res.json({ prediction: "Negative for malaria" });
};

export const predictPneumonia = (req, res) => {
  res.json({ prediction: "Negative for pneumonia" });
};
