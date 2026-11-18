export function lookupErrorMessage(error) {
  const status = error?.response?.status;
  if (status === 404) return 'City not found. Check the spelling or add a country code (for example, Alexandria, EG).';
  if (status === 400) return 'Please enter a valid city name.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status === 401 || status === 403) return 'The weather service is unavailable due to a configuration problem. Please try again later.';
  if (status >= 500) return 'The weather service is temporarily unavailable. Please try again later.';
  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') return 'The request timed out. Please try again.';
  if (!error?.response) return 'Could not connect to the weather service. Check your connection and try again.';
  return 'Could not load the city. Please try again.';
}

export function validCityData(data) {
  return Number.isFinite(data?.sys?.sunset) && Number.isFinite(data?.timezone) &&
    typeof data?.name === 'string' && data.name.length > 0 && typeof data?.sys?.country === 'string';
}
