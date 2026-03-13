Running build in Washington, D.C., USA (East) – iad1
Build machine configuration: 2 cores, 8 GB
Cloning github.com/Xtosea/globelynksnews (Branch: main, Commit: 5b855cb)
Cloning completed: 293.000ms
Restored build cache from previous deployment (BpJxtH5MwtVJSQJ7imz7b4B8V1wq)
Warning: Detected "engines": { "node": ">=20.x" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: https://vercel.link/node-version
Running "vercel build"
Vercel CLI 50.32.4
Warning: Detected "engines": { "node": ">=20.x" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: https://vercel.link/node-version
Installing dependencies...

added 1 package in 12s

268 packages are looking for funding
  run `npm fund` for details
Detected Next.js version: 15.5.9
Running "npm run build"

> build
> next build

   ▲ Next.js 15.5.9

   Creating an optimized production build ...
Failed to compile.

./app/api/import-news/route.js
Module not found: Can't resolve 'node-fetch'

https://nextjs.org/docs/messages/module-not-found


> Build failed because of webpack errors
Error: Command "npm run build" exited with 1