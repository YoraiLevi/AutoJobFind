export class NotImplementedError extends Error{
    constructor(message : string) {
        super(message); // (1)
        this.name = "NotImplementedError"; // (2)
      }
}
//exports.NotImplementedError = NotImplementedError;
