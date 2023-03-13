const R = require("ramda");

export const sortDateAscend = (data) => {
  const diff = function (a, b) {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  };
  return R.sort(diff, data);
};

export const sortDateDesc = (data) => {
  const diff = function (a, b) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };
  return R.sort(diff, data);
};
