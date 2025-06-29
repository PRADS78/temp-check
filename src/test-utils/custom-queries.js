import { queryHelpers, buildQueries } from "@testing-library/dom";

const queryAllByDzUniqueId = (...args) =>
  queryHelpers.queryAllByAttribute("data-dz-unique-id", ...args);

const [
  queryByDzUniqueId,
  getAllByDzUniqueId,
  getByDzUniqueId,
  findAllByDzUniqueId,
  findByDzUniqueId,
] = buildQueries(
  queryAllByDzUniqueId,
  (_, id) => {
    return `Found multiple elements with the [data-dz-unique-id="${id}"]`;
  },
  (_, id) => {
    return `Unable to find an element by: [data-dz-unique-id="${id}"]`;
  }
);

export {
  queryAllByDzUniqueId,
  queryByDzUniqueId,
  getAllByDzUniqueId,
  getByDzUniqueId,
  findAllByDzUniqueId,
  findByDzUniqueId,
};
