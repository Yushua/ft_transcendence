import { Button } from "@mui/material";
import { useEffect, useState } from "react";


export default function ButtonAsyncText(props: any) {
	
	const [text, setText] = useState(null)
	
	useEffect(() => {
		(async () => {
			while (true) {
				try {
					const res = await props.asyncText?.()
					setText(res)
					break
				} catch (error) {
					await new Promise(f => setTimeout(f, 1250));
				}
			}
		})()
	}, [props])
	
	return (
		<Button
		className={props.className}
			style={props.style}
			sx={props.sx}
			key={props.key}
			onClick={text !== null ? props.onClick : () => {}}
			variant={props.variant}
			disabled={text === null}
		>
			{text ?? "Loading..."}
		</Button>
	)
}
