function delay(msec: number, value: any) {
	return new Promise((done) => window.setTimeout(() => done(value), msec));
}

export function isPromisedFinished(promise: Promise<any>) {
	return Promise.race([
		delay(0, false),
		promise.then(
			() => true,
			() => true
		),
	]);
}
