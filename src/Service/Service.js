import APITYPES from "../ApiTypes";

export async function searchUsers(url, apiType, accessToken, params) {
  let request = {
    method: apiType,
    body: JSON.stringify(params),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Token": accessToken,
    },
  };
  return await fetch(url, request)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export async function getLimitedUserDefinedFieldsSummary(url, accessToken) {
  let request = {
    method: APITYPES.GET,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Token": accessToken,
    },
  };
  return await fetch(url, request)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
export function getReportData(url, accessToken) {
  let request = {
    method: APITYPES.GET,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Token": accessToken,
    },
  };

  return fetch(url, request)
    .then(async (response) => {
      if (response.ok) {
        // if HTTP-status is 200-299
        return response.json();
      }
      const result = await response.json();
      return Promise.reject({
        statusText: response.statusText,
        status: response.status,
        message: result?.message ?? result,
      });
    })
    .then((data) => {
      return data;
    });
}
export async function downloadReportData(url, accessToken, bodyParams) {
  let request = {
    method: APITYPES.POST,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Token": accessToken,
    },
  };
  if (bodyParams) {
    request.body = JSON.stringify(bodyParams);
  }
  return await fetch(url, request)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
export async function getExportStatus(url, accessToken) {
  let request = {
    method: APITYPES.GET,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Token": accessToken,
    },
  };

  return await fetch(url, request)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
