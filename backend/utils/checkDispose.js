import axios from 'axios';

export const isDisposableEmail = async (email) => {
  try {
    const { data } = await axios.get(
      `https://disposable.debounce.io/?email=${encodeURIComponent(email)}`,
    );
    return data.disposable === 'true';
  } catch {
    return false;
  }
};
