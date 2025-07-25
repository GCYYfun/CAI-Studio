# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Install Dev Tool

Install node manager - fnm

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

Install node - node 
```bash
fnm install --latest  # Install latest version
```

[Optional] Install node package manager - pnpm
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Ref  
- [fnm](https://github.com/Schniz/fnm)  
- [pnpm](https://pnpm.io/installation)  



## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
