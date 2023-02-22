export default class SSEManager {
	constructor(private readonly _onEvent: (data: string) => void) {}
	
	private _event: EventSource | null = null
	
	async SubscribeToUserEvent(path: string) {
		if (!!this._event)
			this._event.close()
		this._event = new EventSource(path)
		this._event.onmessage = msg => this._onEvent(msg.data)
	}
}
