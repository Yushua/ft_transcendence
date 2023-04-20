import ManualEventManager from "../Events/ManualEventManager"
import { GetCurrentMainWindow, SetMainWindow } from "../MainWindow/MainWindow"

var funcs = {}

export default class OurHistory {
	
	static ClearEvent = new ManualEventManager()
	static WindowChangeEvent = new ManualEventManager()
	
	static Add(entryName: string = "MainWindow", args: any = null, func: (args: URLSearchParams) => void | null = null) {
		OurHistory.WindowChangeEvent.Run()
		funcs[entryName] = func
		
		var params = `?window=${GetCurrentMainWindow()}`
		if (!!args)
			for (const [name, value] of Object.entries(args))
				params += `&${name}=${value}`
				
		window.history.pushState({
			func: entryName,
		}, "", params)
	}
	
	static ManualUpdate(args: URLSearchParams, func: (args: URLSearchParams) => void | null = null, addEntry = false) {
		OurHistory.ClearEvent.Run()
		if (!args)
			return
		SetMainWindow(args.get("window"), addEntry)
		if (!!func)
			func(args)
	}
}

window.onpopstate = (event: any) => {
	OurHistory.ManualUpdate(
		new URLSearchParams(window.location.search),
		funcs[event.state.func],
	)
}
