import { faker } from "@faker-js/faker/locale/en";

const locations = new Array(100).fill(0).map((_, i) => ({
  listItemId: i + 100,
  listItemValue: faker.address.city(),
  isAssignedToUsers: i % 2 == 0,
}));

const designations = new Array(100).fill(0).map((_, i) => ({
  listItemId: i + 200,
  listItemValue: faker.name.jobTitle(),
  isAssignedToUsers: i % 2 == 0,
}));

const departments = new Array(100).fill(0).map((_, i) => ({
  listItemId: i + 300,
  listItemValue: faker.name.jobArea(),
  isAssignedToUsers: false,
}));

const udfs = [
  {
    fieldText: null,
    fieldId: 1,
    fieldName: "Location",
    allowedValues: locations,
    values: locations.map((item) => item.listItemValue),
    isMandatory: false,
    fieldType: "List",
    fieldValue: null,
  },
  {
    fieldText: null,
    fieldId: 2,
    fieldName: "Designation",
    allowedValues: designations,
    values: designations.map((item) => item.listItemValue),
    isMandatory: false,
    fieldType: "List",
    fieldValue: null,
  },
  {
    fieldText: null,
    fieldId: 3,
    fieldName: "Department",
    allowedValues: departments,
    values: departments.map((item) => item.listItemValue),
    isMandatory: false,
    fieldType: "List",
    fieldValue: null,
  },
];

export default udfs;
