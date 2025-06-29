import { useEffect } from "react";

/**
 * Hook to load client-specific CSS overrides dynamically for a microfrontend.
 * @param {string} microfrontendName - The name of the microfrontend.
 * @param {string} clientIdentifier - The unique database pointer for the client.
 */
const useClientSpecificCSSOverrides = (microfrontendName, clientIdentifier) => {
  useEffect(() => {
    if (!microfrontendName || !clientIdentifier) return;

    const mfe = microfrontendName.toLocaleLowerCase();
    const dbPointer = clientIdentifier.toLocaleLowerCase();
    // Construct the URL for the CSS file
    const cssUrl = `https://disprzblobindia.blob.core.windows.net/skilltronassetspublic/appassets/${mfe}_${dbPointer}.css`;

    // Create a new link element
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = cssUrl;
    linkElement.type = "text/css";

    // Append the link to the document head
    document.head.appendChild(linkElement);

    // Clean up the CSS file when the component unmounts or parameters change
    return () => {
      if (document.head.contains(linkElement)) {
        document.head.removeChild(linkElement);
      }
    };
  }, [microfrontendName, clientIdentifier]);
};

export default useClientSpecificCSSOverrides;
