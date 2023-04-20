import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";


export default function ImgAsyncUrl(props: any) {
	
	const [url, setUrl] = useState(null)
	
	useEffect(() => {
		(async () => {
			while (true) {
				try {
					const res = await props.asyncUrl?.()
					setUrl(res)
					break
				} catch (error) {
					await new Promise(f => setTimeout(f, 1250));
				}
			}
		})()
	}, [])
	
	return (
		<img
			className={props.className}
			key={props.key}
			style={props.style}
			src={url ?? ""}
			onClick={url !== null ? props.onClick : () => {}}
		/>
	)
}
