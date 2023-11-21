module.exports = (data) => {
  const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return String(data).toLocaleLowerCase().match(reg);
};
