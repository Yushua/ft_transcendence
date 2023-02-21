export class HTTP {
	static Get(url: string, body: string | null = null, hdr: Map<string, string> | null = null): string 
		{ return this.SendRequest("GET", url, body, hdr) }
	
	static Post(url: string, body: string | null = null, hdr: Map<string, string> | null = null): string
		{ return this.SendRequest("POST", url, body, hdr) }
	
	static Delete(url: string, body: string | null = null, hdr: Map<string, string> | null = null): string 
		{ return this.SendRequest("DELETE", url, body, hdr) }
	
	static async asyncGet(url: string, body: string | null = null, hdr: Map<string, string> | null = null, callback: ((this: XMLHttpRequest, ev: Event) => any) | null = null)
		{ return this.asyncSendRequest("GET", url, body, hdr, callback) }
	
	static async asyncPost(url: string, body: string | null = null, hdr: Map<string, string> | null = null, callback: ((this: XMLHttpRequest, ev: Event) => any) | null = null)
		{ return this.asyncSendRequest("POST", url, body, hdr, callback) }
	
	static async asyncDelete(url: string, body: string | null = null, hdr: Map<string, string> | null = null, callback: ((this: XMLHttpRequest, ev: Event) => any) | null = null)
		{ return this.asyncSendRequest("DELETE", url, body, hdr, callback) }
	
	private static _setupRequest(
			method: string,
			url: string,
			body: string | null,
			hdr: Map<string, string> | null,
			detach: boolean)
			: [XMLHttpRequest, string] {
		var req = new XMLHttpRequest();
		req.open(method, url, detach);
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
			body: string | null,
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
			body: string | null,
			hdr: Map<string, string> | null,
			callback: ((this: XMLHttpRequest, ev: Event) => any) | null) {
		var [req, fianlBody] = this._setupRequest(method, url, body, hdr, false)
		req.onreadystatechange = callback
		req.send(fianlBody)
	}
}
