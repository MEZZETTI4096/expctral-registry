import{_ as x,g as y}from"./index-yOGqFAqU.js";import{f as b,s as E}from"./projectFiles-CgUZHXfs.js";import{r as A}from"./export-DyFHZPBv.js";const c=new TextEncoder,f=t=>`${window.location.origin}/expctral-registry/p/${t}/`;async function O(t,o){var u;const{zipSync:h}=await x(async()=>{const{zipSync:r}=await import("./browser-CGOS5igi.js");return{zipSync:r}},[]),a={},l=[],s=[],n=[];for(const[r,e]of t.entries()){o==null||o({done:r,total:t.length});try{const i=await b(e.slug),d=A(i),$=`${e.slug}/`;d?a[`${$}${e.slug}.exp`]=c.encode(JSON.stringify(d,null,2)):a[`${$}${e.slug}.rft.json`]=c.encode(JSON.stringify(i,null,2));const g=e.author?`${e.author.displayName} (@${e.author.username})`:"autor desconhecido",m=e.isFork&&e.originalAuthor&&e.originalAuthor.id!==((u=e.author)==null?void 0:u.id)?` · criação original de ${e.originalAuthor.displayName} (@${e.originalAuthor.username})`:"";i.license.creditRequired&&l.push(`- ${e.name} — ${g}${m}
  ${f(e.slug)}`),s.push(`- ${e.name} (${d?".exp":".rft"}) — ${f(e.slug)}`)}catch(i){n.push(`${e.name}: ${i instanceof Error?i.message:"falha ao baixar"}`)}}const p=new Date().toISOString().slice(0,10);return l.length&&(a["CREDITOS.txt"]=c.encode(`Créditos obrigatórios

A licença destes projetos exige crédito ao autor quando forem usados:

${l.join(`

`)}
`)),a["LEIA-ME.txt"]=c.encode([`Biblioteca exportada do Expctral Registry em ${p}.`,"","Cada pasta é um projeto. O .exp abre no Prism Studio (Exportar → Abrir…) e pode ser publicado de novo no Registry.","Quando o projeto não saiu do Prism, ou a licença não abre o grafo de nós, vai o .rft.","Os anexos são os da versão mais recente que você pode baixar.","",`Incluídos (${s.length}):`,...s,...n.length?["",`Ficaram de fora (${n.length}):`,...n.map(r=>`- ${r}`)]:[],""].join(`
`)),o==null||o({done:t.length,total:t.length}),E(`expctral-biblioteca-${p}.zip`,h(a,{level:6}),"application/zip"),{included:s.length,skipped:n}}export{O as exportLibrary};
