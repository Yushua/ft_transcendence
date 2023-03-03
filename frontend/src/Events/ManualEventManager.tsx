export default class ManualEventManager {
	constructor (events: (() => void)[] = []) {
		this._events = events
	}
	
	private _events: (() => void)[] = []
	
	Run() {
		for (const func of this._events)
			func()
	}
	
	Subscribe(func: () => void) {
		if (!this._events.includes(func))
			this._events.push(func)
	}
}
