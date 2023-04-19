import { getCookie, removeCookie } from "typescript-cookie"
import User from "./Cache/User"
import ChatUser from "./Cache/ChatUser"
import ChatRoom from "./Cache/ChatRoom"
import { newWindow } from "../App"
import ErrorPage from "../Login/ErrorPage"

export default class HTTP {
	
	static HostRedirect(): string {
		switch (process.env.NODE_ENV) {
			case "development":
				return "http://localhost:4242/"
			default:
				return ""
		}
	}
	
	static Get(url: string, body: string | object | null = null, hdr: object | null = null): string
		{ return this.SendRequest("GET", url, body, hdr) }
	
	static Post(url: string, body: string | object | null = null, hdr: object | null = null): string
		{ return this.SendRequest("POST", url, body, hdr) }
	
	static Patch(url: string, body: string | object | null = null, hdr: object | null = null): string
		{ return this.SendRequest("PATCH", url, body, hdr) }
	
	static Delete(url: string, body: string | object | null = null, hdr: object | null = null): string
		{ return this.SendRequest("DELETE", url, body, hdr) }
	
	static async asyncGet(url: string, body: string | object | null = null, hdr: object | null = null, callback: ((msg: XMLHttpRequest) => any) | null = null, error: ((msg: XMLHttpRequest) => any) | null = null)
		{ return this.asyncSendRequest("GET", url, body, hdr, callback, error) }
	
	static async asyncPost(url: string, body: string | object | null = null, hdr: object | null = null, callback: ((msg: XMLHttpRequest) => any) | null = null, error: ((msg: XMLHttpRequest) => any) | null = null)
		{ return this.asyncSendRequest("POST", url, body, hdr, callback, error) }
	
	static async asyncPatch(url: string, body: string | object | null = null, hdr: object | null = null, callback: ((msg: XMLHttpRequest) => any) | null = null, error: ((msg: XMLHttpRequest) => any) | null = null)
		{ return this.asyncSendRequest("PATCH", url, body, hdr, callback, error) }
	
	static async asyncDelete(url: string, body: string | object | null = null, hdr: object | null = null, callback: ((msg: XMLHttpRequest) => any) | null = null, error: ((msg: XMLHttpRequest) => any) | null = null)
		{ return this.asyncSendRequest("DELETE", url, body, hdr, callback, error) }
	
	private static _setupRequest(
			method: string,
			url: string,
			body: string | object | null,
			hdr: object | null,
			detach: boolean)
			: [XMLHttpRequest, string | FormData] {
		var req = new XMLHttpRequest();
		req.open(method, this.HostRedirect() + url, detach);
		const token = getCookie("accessToken")
		if (!!token)
			req.setRequestHeader("Authorization", `Bearer ${token}`)
		if (!!hdr)
			for (const [name, value] of Object.entries(hdr))
				req.setRequestHeader(name, value)
		if (!body)
			return [req, ""]
		var finalBody: string | FormData = ""
		switch (body.constructor.name) {
			case 'File':
				finalBody = new FormData()
				finalBody.append("file", body as File, (body as File).name)
				break
			case 'Object':
				req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
				for (const [name, value] of Object.entries(body))
					finalBody += `${name}=${value}&`
				break;
			case 'String': finalBody = body as string; break
			default: break
		}
		return [req, finalBody]
	}
	
	static SendRequest(
			method: string,
			url: string,
			body: string | object | null,
			hdr: object | null)
			: string {
		var [req, finalBody] = this._setupRequest(method, url, body, hdr, false)
		req.send(finalBody);
		if (req.status === 401) {
			User.Clear();
			ChatUser.Clear();
			ChatRoom.Clear();
			removeCookie('accessToken');
      		newWindow(<ErrorPage/>)
			return null
		}
		if (req.status < 300)
			return req.responseText
		console.log(req.responseText)
		throw req
	}
	
	static async asyncSendRequest(
			method: string,
			url: string,
			body: string | object | null,
			hdr: object | null,
			callback: ((msg: XMLHttpRequest) => any) | null,
			error: ((msg: XMLHttpRequest) => any) | null) {
		var [req, finalBody] = this._setupRequest(method, url, body, hdr, true)
		req.onload = function(ev) {
			if (req.status === 401) {
				User.Clear();
				ChatUser.Clear();
				ChatRoom.Clear();
				removeCookie('accessToken');
				newWindow(<ErrorPage/>)
				return
			}
			if (!!callback && req.status < 300)
				callback(this)
			else if (!!error)
				error(this)
		}
		req.send(finalBody)
		return req
	}
}
