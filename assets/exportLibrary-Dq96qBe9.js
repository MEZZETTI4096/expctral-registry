import{_ as x,h as y}from"./index-DdxSpA6o.js";import{f as b,a as E,s as A}from"./projectFiles-P3fKBr_3.js";import{r as w}from"./export-CMEhlDrb.js";const c=new TextEncoder,f=o=>`${window.location.origin}/expctral-registry/p/${o}/`;async function j(o,a){var u;const{zipSync:h}=await x(async()=>{const{zipSync:r}=await import("./browser-CGOS5igi.js");return{zipSync:r}},[]),i={},l=[],s=[],n=[];for(const[r,t]of o.entries()){a==null||a({done:r,total:o.length});try{const e=await b(t.slug),d=w(e,await E(e)),$=`${t.slug}/`;d?i[`${$}${t.slug}.exp`]=c.encode(JSON.stringify(d,null,2)):i[`${$}${t.slug}.rft.json`]=c.encode(JSON.stringify(e,null,2));const m=t.author?`${t.author.displayName} (@${t.author.username})`:"autor desconhecido",g=t.isFork&&t.originalAuthor&&t.originalAuthor.id!==((u=t.author)==null?void 0:u.id)?` · criação original de ${t.originalAuthor.displayName} (@${t.originalAuthor.username})`:"";e.license.creditRequired&&l.push(`- ${t.name} — ${m}${g}
  ${f(t.slug)}`),s.push(`- ${t.name} (${d?".exp":".rft"}) — ${f(t.slug)}`)}catch(e){n.push(`${t.name}: ${e instanceof Error?e.message:"falha ao baixar"}`)}}const p=new Date().toISOString().slice(0,10);return l.length&&(i["CREDITOS.txt"]=c.encode(`Créditos obrigatórios

A licença destes projetos exige crédito ao autor quando forem usados:

${l.join(`

`)}
`)),i["LEIA-ME.txt"]=c.encode([`Biblioteca exportada do Expctral Registry em ${p}.`,"","Cada pasta é um projeto. O .exp abre no Prism Studio (Exportar → Abrir…) e pode ser publicado de novo no Registry.","Quando o projeto não saiu do Prism, ou a licença não abre o grafo de nós, vai o .rft.","Os anexos são os da versão mais recente que você pode baixar.","",`Incluídos (${s.length}):`,...s,...n.length?["",`Ficaram de fora (${n.length}):`,...n.map(r=>`- ${r}`)]:[],""].join(`
`)),a==null||a({done:o.length,total:o.length}),A(`expctral-biblioteca-${p}.zip`,h(i,{level:6}),"application/zip"),{included:s.length,skipped:n}}export{j as exportLibrary};
