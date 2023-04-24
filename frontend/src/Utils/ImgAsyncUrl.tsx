import { useEffect, useState } from "react";


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
	}, [props])
	
	return (
		<img
			className={props.className}
			key={props.key}
			alt=""
			style={props.style}
			src={url ?? ""}
			onClick={url !== null ? props.onClick : () => {}}
		/>
	)
}
