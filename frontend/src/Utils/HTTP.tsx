export default class HTTP {
	static HostRedirect(): string {
		switch (process.env.NODE_ENV) {
			case "development":
				return "http://localhost:4242/"
			default:
				return ""
		}
	}
	
	static Get(url: string, body: string | object | null = null, hdr: Map<string, string> | null = null): string
		{ return this.SendRequest("GET", url, body, hdr) }
	
	static Post(url: string, body: string | object | null = null, hdr: Map<string, string> | null = null): string
		{ return this.SendRequest("POST", url, body, hdr) }
	
	static Patch(url: string, body: string | object | null = null, hdr: Map<string, string> | null = null): string
		{ return this.SendRequest("PATCH", url, body, hdr) }
	
	static Delete(url: string, body: string | object | null = null, hdr: Map<string, string> | null = null): string
		{ return this.SendRequest("DELETE", url, body, hdr) }
	
	static async asyncGet(url: string, body: string | object | null = null, hdr: Map<string, string> | null = null, callback: ((msg: XMLHttpRequest) => any) | null = null, error: ((msg: XMLHttpRequest) => any) | null = null)
		{ return this.asyncSendRequest("GET", url, body, hdr, callback, error) }
	
	static async asyncPost(url: string, body: string | object | null = null, hdr: Map<string, string> | null = null, callback: ((msg: XMLHttpRequest) => any) | null = null, error: ((msg: XMLHttpRequest) => any) | null = null)
		{ return this.asyncSendRequest("POST", url, body, hdr, callback, error) }
	
	static async asyncPatch(url: string, body: string | object | null = null, hdr: Map<string, string> | null = null, callback: ((msg: XMLHttpRequest) => any) | null = null, error: ((msg: XMLHttpRequest) => any) | null = null)
		{ return this.asyncSendRequest("PATCH", url, body, hdr, callback, error) }
	
	static async asyncDelete(url: string, body: string | object | null = null, hdr: Map<string, string> | null = null, callback: ((msg: XMLHttpRequest) => any) | null = null, error: ((msg: XMLHttpRequest) => any) | null = null)
		{ return this.asyncSendRequest("DELETE", url, body, hdr, callback, error) }
	
	private static _setupRequest(
			method: string,
			url: string,
			body: string | object | null,
			hdr: Map<string, string> | null,
			detach: boolean)
			: [XMLHttpRequest, string] {
		var req = new XMLHttpRequest();
		req.open(method, this.HostRedirect() + url, detach);
		if (!!hdr)
			for (const [key, value] of Array.from(hdr.entries()))
				req.setRequestHeader(key, value)
		var fianlBody = ""
		if (!!body)
			switch (typeof body) {
				case 'object':
					req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")	
					for (const [name, value] of Object.entries(body))
						fianlBody += `${name}=${value}&`
					break;
				case 'string': fianlBody = body; break
				default: break
			}
		return [req, fianlBody]
	}
	
	static SendRequest(
			method: string,
			url: string,
			body: string | object | null,
			hdr: Map<string, string> | null)
			: string {
		var [req, fianlBody] = this._setupRequest(method, url, body, hdr, false)
		req.send(fianlBody);
		if (req.status === 200)
			return req.responseText
		console.log(req.responseText)
		throw new Error(req.responseText)
	}
	
	static async asyncSendRequest(
			method: string,
			url: string,
			body: string | object | null,
			hdr: Map<string, string> | null,
			callback: ((msg: XMLHttpRequest) => any) | null,
			error: ((msg: XMLHttpRequest) => any) | null) {
		var [req, fianlBody] = this._setupRequest(method, url, body, hdr, true)
		req.onload = function(ev) {
			if (!!callback && req.status < 300)
				callback(this)
			else if (!!error)
				error(this)
		}
		req.send(fianlBody)
	}
}
