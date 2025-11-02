# 🧩 Project Notes — Recipe Book

## 🪄 Summary
A simple recipe manager web app built with Svelte 5 / SvelteKit and Pocketbase.  
Include basic CRUD on recipes, filtering, sorting and pagination of recipes.

---

## 🎯 Purpose / Goal
**Why am I building this?**

- Revisit front end development - Typescript
- Explore / experiment Svelte 5 / SvelteKit
- Learn by building project

---

## ⚙️ Tech Stack
**List the tools and frameworks used**

- **Frontend**: Svelte 5 / SvelteKit, Tailwind CSS, DaisyUI, Lucide Icons
- **Backend**: PocketBase 

---

## ✨ Key Features
- CRUD for recipes  
- Filters by text, category, preparation time (min), sorting
- Simple responsive layout  

---

## 🧠 Notes / Learnings
**Use this section for key takeaways, bugs, or ideas while coding**

- Understand how Svelte 5 reactivity runes work:
    - `$state` can be declared globally and shared by every components
    - `$props` are readonly
    - `$effect` re-runs when reactive values inside it changes
    - `bind:value={}` to setup 2 way bindings
- Understand how Svelte components communication (parent, child, sibbling):
    - Parent --> child: value props
    - Child ---> parent: callbacks props from parent, or dispatch(not learned yet)
    - Sibbling: might use stores
- Svelte component only re render the reactive value part, not the whole component
- Use Snippet to define a reusable svelte html block, without using full .svelte component
- SvelteKit routing use file based system:
    - Setup directory inside `/routes` for routing
    - `page.svelte`: the main route page
    - `page.ts` or `page.server.ts`:
        - Contains code that might populate data to `page.svelte`
        - Run SSR only (`page.server.ts`), or both SSR and CSR (`page.ts`)
    - `layout.svelte`: Shared layout
- SvelteKit use Hydration as default (SSR + CSR):
    - Performs SSR first, serve the full html page
    - Then CSR takes over
- Use SvelteKit `invalidate('<tag>')` to trigger the `load` func in `page.ts` with matching tag to re-runs

---

## 🚀 Next Steps / TODOs
- [ ] Add ingredients list
- [ ] Add multi tag recipes
- [ ] Add ratings recipe
- [ ] User authentication & recipe ownership
---
