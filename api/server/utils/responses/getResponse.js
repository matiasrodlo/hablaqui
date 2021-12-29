/* Keyname must be a string */
export const getResponse = (keyName, data, res) =>
  res.status(200).json({ status: true, [keyName]: data });
