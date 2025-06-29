import { FileTypes } from "../../../Enums";
import { DocumentIcon } from "../../../Icons";
import { ImageIcon } from "../../../Icons";
import { AudioIcon } from "../../../Icons";
import { VideoIcon } from "../../../Icons";

class FileHelpers {
  static get videoExtensions() {
    return ["mp4", "webm", "mov", "m3u8"];
  }

  static fileTypeFromExtension = (extension) => {
    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
        return FileTypes.IMAGE;
      case "mp4":
      case "mov":
        return FileTypes.VIDEO;
      case "mp3":
      case "wav":
      case "aac":
        return FileTypes.AUDIO;
      default:
        return FileTypes.DOCUMENT;
    }
  };

  static fileExtensionFromFileName = (fileName) => {
    const extension = fileName.split(".");
    return extension[extension.length - 1].toLowerCase();
  };

  static uniqueId = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  static downloadUrlAsFile = (fileUrl) => {
    const element = window.document.createElement("a");
    element.href = fileUrl;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  static getFileIcon = (extension) => {
    const fileType = this.fileTypeFromExtension(extension);
    switch (fileType) {
      case FileTypes.IMAGE:
        return <ImageIcon />;
      case FileTypes.AUDIO:
        return <AudioIcon />;
      case FileTypes.VIDEO:
        return <VideoIcon />;
      default:
        return <DocumentIcon />;
    }
  };

  static formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  static getChunkSizeFromFileSize = (fileSize, fileUnit) => {
    let size = Math.floor(fileSize);
    if (fileUnit === "Bytes" || fileUnit === "KB") {
      return 300 * 1024; // 300KB
    } else if (fileUnit === "MB") {
      if (size <= 3) {
        return 500 * 1024; //500KB
      } else if (size > 3 && size <= 15) {
        return 1 * 1024 * 1024; // 1MB
      } else if (size > 15) {
        return 5 * 1024 * 1024; //5MB
      }
    } else {
      return 100 * 1024 * 1024; //100MB
    }
  };
}

export default FileHelpers;
