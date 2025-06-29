import ConversionStatus from "../ConversionStatus";

export class ExportProcessResponse {
  constructor(config = {}) {
    config = config || {};
    this.fileUrl = config.fileUrl || "";
    this.errorMessage = config.errorMessage || "";
    this.exportToken = config.exportToken || "";
    this.exportStatus = config.exportStatus || ConversionStatus.NOTSTARTED;
  }
  isExportStatusCompleted() {
    return this.exportStatus === ConversionStatus.COMPLETED;
  }
  isExportNotStarted() {
    return this.exportStatus === ConversionStatus.NOTSTARTED;
  }
  isExportProcessInProgress() {
    return this.exportStatus === ConversionStatus.INPROGRESS;
  }
  isExportFailed() {
    return this.exportStatus === ConversionStatus.ERROR;
  }
}
