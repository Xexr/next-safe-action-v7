An error when you run next-safe-action v7 with the edge runtime

To demonstrate:

`npm i`

`npm run dev`

open http://localhost:3000

click the button

You'll see an error message in the server console.

Comment out `export const runtime = "edge";` in page.tsx, and the error will disappear.
