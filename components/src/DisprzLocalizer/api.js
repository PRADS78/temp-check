import { invariant } from "../Utils";

const fetchClientSpecificLanguageFile = async ({
  mfe,
  lang,
  clientIdentifier,
}) => {
  return await fetch(
    `https://disprztranslations.blob.core.windows.net/resfiles/microfrontends/${mfe}/client/${clientIdentifier}/res-${lang}.json?v=${new Date().valueOf()}`
  ).then((response) => {
    invariant(response.ok, "Could not fetch client specific translations");
    return response.json();
  });
};

const getResourceForALanguageForAMfe = async ({ mfe, lang }) => {
  return await fetch(
    `https://disprztranslations.blob.core.windows.net/resfiles/microfrontends/${mfe}/res-${lang}.json?v=${new Date().valueOf()}`
  ).then((response) => {
    invariant(
      response.ok,
      `Could not fetch the translations for language ${lang}`
    );
    return response.json();
  });
};

export { fetchClientSpecificLanguageFile, getResourceForALanguageForAMfe };
