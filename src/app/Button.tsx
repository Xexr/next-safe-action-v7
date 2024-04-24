"use client";

import { testAction } from "@/server/actions";

const Button = () => {
	return (
		<button
			onClick={async () => {
				const result = await testAction({ message: "v7 is working!" });

				console.log("Result ->", result.data);
			}}
		>
			Test action
		</button>
	);
};
export default Button;
