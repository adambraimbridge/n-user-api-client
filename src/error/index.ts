
export class ErrorWithData extends Error {
    public data: object;
    public name: string;

	constructor (message, data = {}) {
		super(message);
		this.data = data;
		this.name = this.constructor.name;
	}
}
