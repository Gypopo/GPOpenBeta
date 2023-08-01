export class Beta {

    /**
    * @param {string} version
    * @param {string} changelog
    * @param {string} releaseDate
    */
    constructor(version, changelog, releaseDate) {
        this.version = version;
        this.changelog = changelog.replace(/\\u0020/g,' ').split("\\n");
        this.releaseDate = releaseDate;
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
     * @returns {number}
     */
    getReleaseDate() {
        return this.releaseDate;
    }
}