export default class SSEManager {
	constructor(private readonly _onEvent: (data: string) => void) {}
	
	private _event: EventSource | null = null
	private currentPath: string = ""
	
	async SubscribeToUserEvent(path: string) {
		if (path === this.currentPath)
			return
		this.currentPath = path
		if (!!this._event)
			this._event.close()
		this._event = new EventSource("http://localhost:4242/" + path)
		this._event.onmessage = msg => this._onEvent(msg.data)
	}
}
