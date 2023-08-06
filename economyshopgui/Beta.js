export class Beta {

    /**
    * @param {string} version
    * @param {string} changelog
    * @param {string} releaseDate
    * @param {long} fileSize
    * @param {number} downloads
    */
    constructor(version, changelog, releaseDate, fileSize, downloads) {
        this.version = version;
        this.changelog = changelog.replace(/\\u0020/g,' ').split("\\n");
        this.releaseDate = releaseDate;
        this.fileSize = fileSize;
        this.downloads = downloads;
    }

    /**
     * @returns {string}
     */
    getVersion() {
        return this.version;
    }

    /**
     * @returns {string}
     */
    getChangelog() {
        return this.changelog;
    }

    /**
     * @returns {string}
     */
    getReleaseDate() {
        return this.releaseDate;
    }

    /**
     * @returns {long}
     */
    getFileSize() {
        return this.fileSize;
    }

    /**
     * @returns {number}
     */
    getDownloads() {
        return this.downloads;
    }
}