const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  return { error, value };
};

export default validate;
