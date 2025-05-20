function parseCurrencyToNumber(currency) {
  // Step 1: Remove the currency symbol and any non-numeric characters
  let numericString = currency.replace(/[^\d,]/g, "");

  // Step 2: Replace the comma with a dot
  numericString = numericString.replace(",", ".");

  // Step 3: Convert the resulting string to a number
  return parseFloat(numericString);
}

export default parseCurrencyToNumber;
