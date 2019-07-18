const param2string = (params) => {
  let ps = Object.keys(params).map(key => {
    const value = (params[key] === undefined || params[key] === null) ?  '' : params[key];

    return `${key}=${value}`;
  });

  return ps.join('&');
};

export {
  param2string
}