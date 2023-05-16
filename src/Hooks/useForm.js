import { useState } from 'react';

const types = {
  email: {
    regex:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: 'Preencha um email válido',
  },
  number: {
    regex: /^\d+$/,
    message: 'Utilize apenas números.',
  },
};

const useForm = (initialValue = '') => {
  const type = true;
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  const validate = (string) => {
    if (type === false) return true;
    if (string.length === 0) {
      setError('Can’t be empty');
      return false;
    }
    if (types[type] && !types[type].regex.test(string)) {
      setError(types[type].message);
      return false;
    }
    setError(null);
    return true;
  };

  const onChange = ({ target }) => {
    if (error) validate(target.value);
    setValue(target.value);
  };

  return {
    value,
    setValue,
    onChange,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value),
  };
};

export default useForm;
