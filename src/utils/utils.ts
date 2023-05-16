export const validateJSON = (string: string) => {
  const isEmptyJSON = string.trim().length < 1;
  if (isEmptyJSON) return { isValidJSON: true, jsonData: {} };
  let json;
  try {
    json = JSON.parse(string);
  } catch (e) {
    const errors = [new Error('Variables JSON is not valid\n')];
    if (e instanceof SyntaxError) errors.push(e);

    return { isValidJSON: false, jsonData: { errors } };
  }
  return { isValidJSON: true, jsonData: json };
};
