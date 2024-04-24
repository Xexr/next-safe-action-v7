import Button from "./Button";

export const runtime = "edge"; // <<<< ---- Comment this out and the error will go away

export default function Home() {
	return (
		<main>
			<Button />
		</main>
	);
}
