import { orderBy, take, drop } from "lodash";
import { faker } from "@faker-js/faker/locale/en";

const dataLength = 900;
const data = new Array(dataLength).fill(0).map((_, index) => {
  const gender = faker.name.sex();
  return {
    firstName: faker.name.firstName(gender),
    lastName:
      Math.floor(Math.random() * 10) % 2 === 0
        ? faker.name.lastName(gender)
        : "",
    gender: gender,
    age: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    imageUrl:
      index === 0
        ? faker.image.avatar()
        : Math.floor(Math.random() * 10) % 2 === 0
        ? faker.image.avatar()
        : null,
    joiningDate: faker.date.birthdate({ min: 2020, max: 2022, mode: "year" }),
    location: faker.datatype.number({ min: 100, max: 200 }),
    designation: faker.datatype.number({ min: 200, max: 300 }),
    department: faker.datatype.number({ min: 300, max: 400 }),
    bookingDate: faker.date.recent(5),
    favoriteNumber: faker.datatype.number({ min: 0, max: 100 }),
  };
});

const getTableRows = ({
  limit,
  offset,
  sortBy,
  sortOrder,
  searchText,
  filters,
}) => {
  let tableRows = data;
  if (filters.length > 0) {
    tableRows = tableRows.filter((row) => {
      let isGenerallyFiltered = true,
        isDobFiltered = true,
        isAgeFiltered = true,
        isLocationFiltered = true,
        isDesignationFiltered = true,
        isDepartmentFiltered = true,
        isBookingDateFiltered = true,
        isFavoriteNumberFiltered = true;
      filters.forEach((filter) => {
        if (filter.fieldName === "joiningDate") {
          isDobFiltered =
            Date.parse(row.joiningDate) >= Date.parse(filter.value[0]) &&
            Date.parse(row.joiningDate) <= Date.parse(filter.value[1]);
        } else if (filter.fieldName === "age") {
          isAgeFiltered =
            new Date().getFullYear() - new Date(row.age).getFullYear() >=
              filter.value[0] &&
            new Date().getFullYear() - new Date(row.age).getFullYear() <=
              filter.value[1];
        } else if (filter.fieldName === "1") {
          // Location
          isLocationFiltered = filter.value.includes(row.location.toString());
        } else if (filter.fieldName === "2") {
          // Designation
          isDesignationFiltered = filter.value.includes(
            row.designation.toString()
          );
        } else if (filter.fieldName === "3") {
          // Department
          isDepartmentFiltered = filter.value.includes(
            row.department.toString()
          );
        } else if (filter.fieldName === "bookingDate") {
          isBookingDateFiltered =
            new Date(filter.value[0]) < row.bookingDate &&
            row.bookingDate > new Date(filter.value[1]);
        } else if (filter.fieldName === "favoriteNumber") {
          isFavoriteNumberFiltered =
            filter.value[0] < row.favoriteNumber &&
            row.favoriteNumber < filter.value[1];
        } else {
          isGenerallyFiltered = filter.value.includes(row[filter.fieldName]);
        }
      });
      return (
        isGenerallyFiltered &&
        isDobFiltered &&
        isAgeFiltered &&
        isLocationFiltered &&
        isDesignationFiltered &&
        isDepartmentFiltered &&
        isBookingDateFiltered &&
        isFavoriteNumberFiltered
      );
    });
  }
  if (searchText) {
    tableRows = tableRows.filter((rows) =>
      rows.username.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  if (sortBy && sortOrder) {
    tableRows = orderBy(tableRows, sortBy, sortOrder);
  }
  return {
    rows: take(drop(tableRows, offset), limit),
    total: tableRows.length,
  };
};

const getTableRowsWithoutTotal = ({
  limit,
  offset,
  sortBy,
  sortOrder,
  searchText,
  filters,
}) => {
  let tableRows = data;
  if (filters.length > 0) {
    tableRows = tableRows.filter((row) => {
      let isGenerallyFiltered = true,
        isDobFiltered = true,
        isAgeFiltered = true,
        isLocationFiltered = true,
        isDesignationFiltered = true,
        isDepartmentFiltered = true,
        isBookingDateFiltered = true,
        isFavoriteNumberFiltered = true;
      filters.forEach((filter) => {
        if (filter.fieldName === "joiningDate") {
          isDobFiltered =
            Date.parse(row.joiningDate) >= Date.parse(filter.value[0]) &&
            Date.parse(row.joiningDate) <= Date.parse(filter.value[1]);
        } else if (filter.fieldName === "age") {
          isAgeFiltered =
            new Date().getFullYear() - new Date(row.age).getFullYear() >=
              filter.value[0] &&
            new Date().getFullYear() - new Date(row.age).getFullYear() <=
              filter.value[1];
        } else if (filter.fieldName === "1") {
          // Location
          isLocationFiltered = filter.value.includes(row.location.toString());
        } else if (filter.fieldName === "2") {
          // Designation
          isDesignationFiltered = filter.value.includes(
            row.designation.toString()
          );
        } else if (filter.fieldName === "3") {
          // Department
          isDepartmentFiltered = filter.value.includes(
            row.department.toString()
          );
        } else if (filter.fieldName === "bookingDate") {
          isBookingDateFiltered =
            new Date(filter.value[0]) < row.bookingDate &&
            row.bookingDate > new Date(filter.value[1]);
        } else if (filter.fieldName === "favoriteNumber") {
          isFavoriteNumberFiltered =
            filter.value[0] < row.favoriteNumber &&
            row.favoriteNumber < filter.value[1];
        } else {
          isGenerallyFiltered = filter.value.includes(row[filter.fieldName]);
        }
      });
      return (
        isGenerallyFiltered &&
        isDobFiltered &&
        isAgeFiltered &&
        isLocationFiltered &&
        isDesignationFiltered &&
        isDepartmentFiltered &&
        isBookingDateFiltered &&
        isFavoriteNumberFiltered
      );
    });
  }
  if (searchText) {
    tableRows = data.filter((rows) =>
      rows.username.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  if (sortBy && sortOrder) {
    tableRows = orderBy(tableRows, sortBy, sortOrder);
  }
  return {
    rows: take(drop(tableRows, offset), limit),
    isTruncated: take(drop(tableRows, offset + limit), 1).length === 0,
  };
};

const getTableAllRowsUserName = () => {
  return data.map((r) => {
    return r.username;
  });
};

const getTableAllRows = () => {
  return data;
};

const getTableGlobalFilters = () => {
  const bookingDate = data.map((item) => {
    return item.bookingDate;
  });
  return {
    bookingDate: [
      new Date(Math.min(...bookingDate)),
      new Date(Math.max(...bookingDate)),
    ],
    favoriteNumber: [0, 100],
  };
};

export {
  getTableRows,
  getTableAllRowsUserName,
  getTableRowsWithoutTotal,
  getTableAllRows,
  getTableGlobalFilters,
};
