export const success = (res, message = "Success", data = {}) => {
  return res.json({ success: true, message, data });
};

export const error = (res, message = "Something went wrong") => {
  return res.status(400).json({ success: false, message });
};
