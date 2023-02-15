class myError {
    constructor(errObj) {
        const errStr = JSON.stringify(errObj);
        return new Error(errStr);
    }
}
module.exports = myError;