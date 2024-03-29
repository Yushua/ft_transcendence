import { Controller, Get, Post, Patch, Delete, Body, Param, Sse, Headers, Req, Request, Response, StreamableFile } from '@nestjs/common';
import { createReadStream } from "fs"
import { readFileSync } from "fs"
import { lookup } from 'mime-types';
import { join } from 'path';

export class ChatApp {
	static GetWebAppFiles(url: string, response) { 
			const actualPath: string = `../frontend/build/${url}`
			response.set({'Content-Type': lookup(actualPath)})
			const file = createReadStream(join(process.cwd(), actualPath))
			return new StreamableFile(file)
		}
}
