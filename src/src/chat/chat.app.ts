import { readFileSync } from "fs"

export class ChatApp {
	static GetWebApp(): string
		{ return readFileSync('./src/chat/webapp.html').toString() }
}
