import { createRef, Component } from "react";
import "./LocalFileSelector.scss";

class LocalFileSelector extends Component {
  constructor(props) {
    super(props);

    this.localFileSelectorRef = createRef();

    this.id = this.props.id || "_harnessLocalFilePicker";
    this.allowedFileTypes = this.props.allowedFileTypes || []; // Array of supported Mime Types per the SupportedFileTypes ENUM (below)
    this.allowMultiSelect = this.props.allowMultiSelect || false;
    this.notallowedFileTypes = [
      "exe",
      "bat",
      "dmg",
      "cmd",
      "dll",
      "com",
      "executable",
      "sh",
    ]; // "executable" here covers most of windows executable files
    this.onFileSelectChange = this.props.onFileSelectChange || {};
    this.onFileSelectionFailed = this.props.onFileSelectionFailed || {};

    this.state = {
      allowedFileTypes: [],
    };
  }

  componentDidMount() {
    const localFileSelectorEle = this.localFileSelectorRef.current;
    if (localFileSelectorEle) {
      localFileSelectorEle.addEventListener("change", () => {
        const filePickValue = localFileSelectorEle.files[0],
          fileType = filePickValue.name.split(".").pop().toLowerCase();

        //check for Not allowed file types before checking allowed
        if (this.notallowedFileTypes.includes(fileType)) {
          localFileSelectorEle.value = "";
          this.onFileSelectionFailed(fileType);
          return;
        }
        if (
          this.allowedFileTypes.length > 0 &&
          !this.allowedFileTypes.includes(fileType)
        ) {
          localFileSelectorEle.value = "";
          this.onFileSelectionFailed(fileType);
          return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target.readyState === FileReader.DONE) {
            const uint = new Uint8Array(evt.target.result);
            const bytes = [];
            uint.forEach((byte) => {
              if (byte.toString().length == 1) {
                byte = "0" + byte;
              }
              bytes.push(byte.toString(16));
            });
            const hex = bytes.join("").toUpperCase(),
              possibleFileType = this.getMimetype(hex);
            if (possibleFileType !== 0) {
              this.onFileSelectionFailed(possibleFileType.extension);
            } else {
              this.onFileSelectChange(this);
            }
          }
        };

        const slice = filePickValue.slice(0, 4); // slicing 1st 4 bits of file
        reader.readAsArrayBuffer(slice); // reading file as Array Buffer
      });
    }
  }

  getMimetype = (signature) => {
    switch (true) {
      case signature.startsWith("23212F62"):
        return { extension: "sh", mimeType: "text/x-sh" };
      case signature.startsWith("4D5A"):
        // this will take care of all executable files including COM, DLL, DRV, EXE, PIF, QTS, QTX, SYS ,VBX , VXD, FON, CPL
        return {
          extension: "executable",
          mimeType: "application/x-msdownload",
        };
      case signature.startsWith("FA33"):
        return { extension: "com", mimeType: "application/x-msdownload" };
      case signature.startsWith("40494620"):
        return { extension: "cmd", mimeType: "text/x-cmd" };
      case signature.startsWith("40656368"):
        return { extension: "bat", mimeType: "magnus-internal/cgi" };
      default:
        return 0;
    }
  };

  openFileBrowser() {
    const localFileSelectorEle = this.localFileSelectorRef.current;
    if (localFileSelectorEle) {
      localFileSelectorEle.value = "";
      const evObj = document.createEvent("MouseEvents");
      evObj.initEvent("click", true, true);
      localFileSelectorEle.dispatchEvent(evObj);
    }
  }

  isFileSelected() {
    const localFileSelectorEle = this.localFileSelectorRef.current;
    if (localFileSelectorEle) {
      return !(
        typeof localFileSelectorEle === "undefined" ||
        localFileSelectorEle === null ||
        localFileSelectorEle.value === null ||
        localFileSelectorEle.value === ""
      );
    }
    return false;
  }

  getFile() {
    const localFileSelectorEle = this.localFileSelectorRef.current;
    return localFileSelectorEle ? localFileSelectorEle.files[0] : {};
  }

  getFileSize() {
    const localFileSelectorEle = this.localFileSelectorRef.current;
    return localFileSelectorEle ? localFileSelectorEle.files[0].size : 0;
  }

  getFiles() {
    const localFileSelectorEle = this.localFileSelectorRef.current;
    return localFileSelectorEle ? localFileSelectorEle.files : {};
  }

  getFileName() {
    var fileName = "";
    const localFileSelectorEle = this.localFileSelectorRef.current;
    if (localFileSelectorEle && this.isFileSelected()) {
      fileName = localFileSelectorEle.value.split("/").pop().split("\\").pop();
    }
    return fileName;
  }

  setAllowedFileTypes(allowedFileTypes) {
    this.setState({
      allowedFileTypes: allowedFileTypes,
    });
  }

  render() {
    var isMultiple = false,
      allowedFileTypes = "";

    if (this.allowMultiSelect) {
      isMultiple = true;
    }

    if (this.allowedFileTypes.length > 0) {
      allowedFileTypes = this.allowedFileTypes.join(",");
    }

    if (this.state.allowedFileTypes.length > 0) {
      var newAllowedFileTypes = this.state.allowedFileTypes;
      allowedFileTypes = newAllowedFileTypes.join(",");
    }

    return (
      <input
        id={this.id}
        className="local-file-selector"
        type="file"
        ref={this.localFileSelectorRef}
        multiple={isMultiple}
        accept={allowedFileTypes}
      />
    );
  }
}

export default LocalFileSelector;
