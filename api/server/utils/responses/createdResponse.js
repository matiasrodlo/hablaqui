/* Keyname must be a string */
export const createdResponse = (keyName, data, res) =>
  res.status(201).json({ status: true, [keyName]: data })
