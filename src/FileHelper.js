export const downloadUrlAsFile = (fileUrl) => {
  let a = window.document.createElement("a");
  a.href = fileUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
