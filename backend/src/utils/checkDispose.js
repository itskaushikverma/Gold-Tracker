import axios from 'axios';

export const isDisposableEmail = async (email) => {
  try {
    const { data } = await axios.get(`https://disposable.debounce.io/?email=${email}`);
    return data.disposable === 'true';
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};
