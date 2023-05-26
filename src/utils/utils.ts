export const validateJSON = (string: string, source: string) => {
  const isEmptyJSON = string.trim().length < 1;
  if (isEmptyJSON) return { isValidJSON: true, jsonData: {} };
  let json;
  try {
    json = JSON.parse(string);
  } catch (e) {
    const errors = [new Error(source + ' JSON is not valid\n')];
    if (e instanceof SyntaxError) errors.push(e);

    return { isValidJSON: false, jsonData: { errors } };
  }
  return { isValidJSON: true, jsonData: json };
};
