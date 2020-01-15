export class NotImplementedError extends Error{
    constructor(message) {
        super(message); // (1)
        this.name = "NotImplementedError"; // (2)
      }
}
//exports.NotImplementedError = NotImplementedError;
