// packages/comp-core/dist/types/player.js
function e(e, t, n) {
	return Object.freeze({
		ready: !1,
		code: "POLISH_REQUIRED",
		integration: e,
		requirement: t,
		dependsOn: Object.freeze([...n])
	});
}
function t(e) {
	return e.ready;
}
function n(e) {
	let t = e.dependsOn.length ? ` Depende de: ${e.dependsOn.join(", ")}.` : "";
	return `Integração "${e.integration}" indisponível: ${e.requirement}.${t}`;
}
var r = "expctral.exp", i = (e) => ({
	ok: !0,
	value: e
}), a = (e) => ({
	ok: !1,
	error: e
}), o = class extends Error {
	code;
	constructor(e, t) {
		super(t), this.code = e, this.name = "CompCoreError";
	}
};
// packages/comp-core/dist/time/rational.js
function s(e, t) {
	for (e = e < 0n ? -e : e, t = t < 0n ? -t : t; t;) {
		let n = e % t;
		e = t, t = n;
	}
	return e || 1n;
}
function c(e, t) {
	if (t === 0n) throw RangeError("denominator cannot be zero");
	t < 0n && (e = -e, t = -t);
	let n = s(e, t);
	return {
		numerator: e / n,
		denominator: t / n
	};
}
c(24n, 1n), c(60n, 1n), c(120n, 1n), c(24000n, 1001n), c(30000n, 1001n), c(60000n, 1001n);
// packages/comp-core/dist/schema/document.js
function l(...e) {
	let t = {};
	for (let n of e) if (n) for (let [e, r] of Object.entries(n)) t[e] = r;
	return t;
}
function u(e, t, n) {
	return l(e, t, n);
}
function d(e) {
	if (typeof e == "bigint") return JSON.stringify(e.toString());
	if (e === void 0) return "null";
	if (Array.isArray(e)) return `[${e.map(d).join(",")}]`;
	if (e && typeof e == "object") {
		let t = e;
		return `{${Object.keys(t).sort().map((e) => `${JSON.stringify(e)}:${d(t[e])}`).join(",")}}`;
	}
	return JSON.stringify(e) ?? "null";
}
function f(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t >>> 0;
}
function p(e) {
	return `0x${f(d(e)).toString(16).padStart(8, "0")}`;
}
// packages/comp-core/dist/compiler/compile.js
var m = {
	step: 0,
	linear: 1,
	bezier: 2,
	hermite: 3
}, h = {
	hold: 0,
	linear: 1,
	repeat: 2,
	mirror: 3
}, g = {
	"position.x": 0,
	"position.y": 1,
	"position.z": 2,
	"scale.x": 3,
	"scale.y": 4,
	"scale.z": 5,
	"rotation.x": 6,
	"rotation.y": 7,
	"rotation.z": 8,
	opacity: 9,
	"color.x": 10,
	"color.y": 11,
	"color.z": 12,
	"color.w": 13,
	"color.r": 10,
	"color.g": 11,
	"color.b": 12,
	"color.a": 13,
	"uvOffset.x": 14,
	"uvOffset.y": 15,
	"customParams.x": 16,
	"customParams.y": 17,
	"customParams.z": 18,
	"customParams.w": 19
}, _ = {
	"stage.camera.position.x": 100,
	"stage.camera.position.y": 101,
	"stage.camera.position.z": 102,
	"stage.camera.target.x": 103,
	"stage.camera.target.y": 104,
	"stage.camera.target.z": 105,
	"stage.camera.fov": 106,
	"stage.camera.trauma": 107,
	"stage.light.direction.x": 110,
	"stage.light.direction.y": 111,
	"stage.light.direction.z": 112,
	"stage.light.color.x": 113,
	"stage.light.color.y": 114,
	"stage.light.color.z": 115,
	"stage.light.color.r": 113,
	"stage.light.color.g": 114,
	"stage.light.color.b": 115,
	"stage.light.intensity": 116,
	"stage.post.exposure": 117,
	"stage.post.bloom": 118,
	"stage.post.vignette": 119,
	"stage.post.chromaticAberration": 120
};
function v(e, t, n, r) {
	let i = [...e.tracks], a = [...e.clips], s = [...e.markers];
	for (let c of e.preComps ?? []) {
		if (n <= 0) throw new o("CYCLIC_DEPENDENCY", "Pre-Comp depth limit exceeded");
		if (r.includes(c.compositionId)) throw new o("CYCLIC_DEPENDENCY", `Pre-Comp cycle: ${[...r, c.compositionId].join(" -> ")}`);
		let e = t.get(c.compositionId);
		if (!e) throw new o("INVALID_PRECOMP", `Missing Pre-Comp ${c.compositionId}`);
		let l = v(e, t, n - 1, [...r, c.compositionId]), d = `${c.id}::`, f = new Map(l.tracks.map((e) => [e.id, `${d}${e.id}`]));
		for (let e of l.tracks) i.push({
			...e,
			id: f.get(e.id),
			name: `${e.name} / ${c.id}`
		});
		let p = new Map(l.clips.map((e) => [e.id, `${d}${e.id}`])), m = /* @__PURE__ */ new Map();
		for (let [e, t] of Object.entries(c.promotedControls ?? {})) {
			if (!Object.prototype.hasOwnProperty.call(c.overrides ?? {}, e)) continue;
			let n = t.startsWith("/clips/") ? t.slice(7).replace(/\//g, ".") : t, r = !1;
			for (let t of l.clips) {
				let i = String(t.id);
				if (n.startsWith(`${i}.`)) {
					let t = n.slice(i.length + 1), a = m.get(i) ?? {};
					a[t] = c.overrides[e], m.set(i, a), r = !0;
					break;
				}
			}
			if (!r) throw new o("MISSING_REFERENCE", `Promoted control ${e} references ${t}`);
		}
		let h = { ...c.overrides };
		for (let e of Object.keys(c.promotedControls ?? {})) delete h[e];
		for (let e of l.clips) {
			let t = e.parentClipId ? p.get(e.parentClipId) : void 0, n = e.trigger ? p.get(e.trigger.after) : void 0, r = m.get(String(e.id)) ?? {}, i = e.overrides ?? {}, o = u(e.source.defaults, {
				...h,
				...r
			}, i), s = e.curves ? { ...e.curves } : void 0;
			if (s) for (let e of Object.keys(r)) Object.prototype.hasOwnProperty.call(i, e) || delete s[e];
			a.push({
				...e,
				id: p.get(e.id),
				trackId: f.get(e.trackId),
				start: e.start + c.start,
				end: e.end + c.start,
				overrides: o,
				...s ? { curves: s } : {},
				...t ? { parentClipId: t } : {},
				...e.trigger && n ? { trigger: {
					...e.trigger,
					after: n
				} } : {}
			});
		}
		for (let e of l.markers) s.push({
			...e,
			id: `${d}${e.id}`,
			tick: e.tick + c.start
		});
	}
	return {
		tracks: i,
		clips: a,
		markers: s
	};
}
function y(e) {
	return Array.isArray(e) ? { keys: e } : e;
}
function b(e, t) {
	return typeof e == "number" ? e : e[t] ?? 0;
}
function x(e, t, n, r) {
	if (!e) return r;
	let i = e[t];
	return i === void 0 ? r : typeof i == "number" ? i : i[n] ?? r;
}
function S(e, t = /* @__PURE__ */ new Map(), n = {}) {
	if (e.version !== 3) throw new o("INVALID_COMPOSITION", "Only .exp v3 documents are supported");
	let r = v(e, t, n.maxPreCompDepth ?? 16, [e.id]), i = r.clips.map((e) => ({
		...e,
		overrides: u(e.source.defaults, void 0, e.overrides)
	})), { introEnd: a, loopEnd: s, duration: c } = e.sections;
	if (a < 0 || a > s || s > c) throw new o("INVALID_COMPOSITION", "Invalid section ordering");
	let l = /* @__PURE__ */ new Set();
	for (let e of i) {
		if (l.has(e.id)) throw new o("DUPLICATE_ID", `Duplicate clip ${e.id}`);
		if (l.add(e.id), e.start < 0 || e.end < e.start) throw new o("INVALID_COMPOSITION", `Invalid range on ${e.id}`);
	}
	let d = new Map(i.map((e, t) => [e.id, t])), f = new Int32Array(i.length), S = i.map(() => []);
	i.forEach((e, t) => {
		for (let n of [e.parentClipId, e.trigger?.after]) if (n) {
			let e = d.get(n);
			if (e === void 0) throw new o("MISSING_REFERENCE", `Missing clip ${n}`);
			S[e]?.push(t), f[t] = (f[t] ?? 0) + 1;
		}
	});
	let C = [];
	f.forEach((e, t) => {
		e === 0 && C.push(t);
	}), C.sort((e, t) => String(i[e]?.id).localeCompare(String(i[t]?.id)));
	let w = [];
	for (; C.length;) {
		let e = C.shift();
		if (e === void 0) break;
		w.push(e);
		for (let t of S[e] ?? []) f[t] = (f[t] ?? 0) - 1, f[t] === 0 && (C.push(t), C.sort((e, t) => String(i[e]?.id).localeCompare(String(i[t]?.id))));
	}
	if (w.length !== i.length) throw new o("CYCLIC_DEPENDENCY", "Clip trigger/parent graph contains a cycle");
	let T = w.map((e) => i[e]), E = new Map(T.map((e, t) => [e.id, t])), D = T.map((e) => ({
		...e,
		resolvedStart: e.trigger ? Math.max(e.start, (T.find((t) => t.id === e.trigger?.after)?.end ?? 0) + e.trigger.offset) : e.start,
		resolvedEnd: e.end,
		parentClipIndex: e.parentClipId ? E.get(e.parentClipId) ?? -1 : -1,
		triggerIndex: e.trigger ? E.get(e.trigger.after) ?? -1 : -1
	})), O = [];
	function k(e, t, n = "") {
		for (let [r, i] of Object.entries(e ?? {})) {
			let e = y(i), a = [...e.keys].sort((e, t) => e.tick - t.tick);
			if (!a.length) continue;
			for (let e = 1; e < a.length; e++) if (a[e]?.tick === a[e - 1]?.tick) throw new o("INVALID_COMPOSITION", `Duplicate curve tick in ${r}`);
			let s = Array.isArray(a[0]?.value) ? (a[0]?.value).length : 1;
			if (s < 1 || s > 4) throw new o("INVALID_COMPOSITION", `Invalid vector dimension in ${r}`);
			let c = [
				"x",
				"y",
				"z",
				"w"
			];
			for (let i = 0; i < s; i++) {
				let o = `${n}${r}${s > 1 ? "." + c[i] : ""}`, l = t < 0 ? _[o] ?? -1 : g[o] ?? -1;
				O.push({
					clipIndex: t,
					slot: l,
					path: o,
					keys: a,
					component: i,
					pre: h[e.preExtrapolation ?? "hold"],
					post: h[e.postExtrapolation ?? "hold"]
				});
			}
		}
	}
	D.forEach((e, t) => k(e.curves, t)), k(e.stage?.curves, -1, "stage.");
	for (let t of [
		"camera",
		"light",
		"post"
	]) {
		let n = e.stage?.[t];
		n && n.curves && typeof n.curves == "object" && k(n.curves, -1, `stage.${t}.`);
	}
	let A = O.length, j = new Int32Array(A), M = new Int32Array(A), N = new Int32Array(A), P = new Int16Array(A), F = new Uint8Array(A), I = new Uint8Array(A), L = 0;
	O.forEach((e, t) => {
		j[t] = L, M[t] = e.keys.length, N[t] = e.clipIndex, P[t] = e.slot, F[t] = e.pre, I[t] = e.post, L += e.keys.length;
	});
	let R = new Float64Array(L), z = new Float64Array(L), B = new Uint8Array(L), V = new Float64Array(L * 2), H = new Float64Array(L * 2), U = 0;
	for (let e of O) for (let t of e.keys) {
		let n = b(t.value, e.component);
		R[U] = t.tick, z[U] = n, B[U] = m[t.mode], V[U * 2] = x(t.inHandle, 0, e.component, t.tick), V[U * 2 + 1] = x(t.inHandle, 1, e.component, n), H[U * 2] = x(t.outHandle, 0, e.component, t.tick), H[U * 2 + 1] = x(t.outHandle, 1, e.component, n), U++;
	}
	let ee = {
		...e,
		tracks: r.tracks,
		clips: D,
		markers: r.markers
	};
	return {
		id: e.id,
		name: e.name,
		frameRate: e.frameRate,
		sections: e.sections,
		tracks: r.tracks,
		clips: D,
		markers: r.markers,
		curveTables: {
			curveKeyOffsets: j,
			curveKeyCounts: M,
			curveClipIndices: N,
			curveSlots: P,
			curvePaths: O.map((e) => e.path),
			curvePreExtrapolations: F,
			curvePostExtrapolations: I,
			keyTicks: R,
			keyValues: z,
			keyModes: B,
			keyInHandles: V,
			keyOutHandles: H
		},
		digest: p(ee),
		stage: e.stage
	};
}
function C(e) {
	if (!e.startsWith("param.")) return null;
	let t = e.slice(6).split(".");
	return t.length !== 2 || !t[0] || !t[1] ? null : {
		node: t[0],
		param: t[1]
	};
}
function w(e) {
	let t = /^param\.([^.]+)\.([^.]+)(?:\.([xyzw]))?$/.exec(e);
	return t ? {
		target: {
			node: t[1],
			param: t[2]
		},
		component: t[3] === void 0 ? -1 : "xyzw".indexOf(t[3])
	} : null;
}
var T = (e) => {
	let t = Math.min(1, Math.max(0, e)), n = t <= .0031308 ? t * 12.92 : 1.055 * t ** (1 / 2.4) - .055;
	return Math.round(n * 255);
};
function E(e, t, n) {
	return `#${[
		e,
		t,
		n
	].map((e) => T(e).toString(16).padStart(2, "0")).join("")}`;
}
// packages/comp-core/dist/player/clip-events.js
function D(e, t) {
	let { space: n, value: r } = t.at;
	return n === "afterStart" ? e.resolvedStart + r : n === "beforeEnd" ? e.resolvedEnd - r : e.resolvedStart + Math.floor((e.resolvedEnd - e.resolvedStart) * r / 100);
}
function O(e) {
	let t = e.indexOf(".");
	return t <= 0 || t === e.length - 1 || e.indexOf(".", t + 1) !== -1 ? null : {
		node: e.slice(0, t),
		param: e.slice(t + 1)
	};
}
function k(e) {
	return (e.events ?? []).map((t, n) => ({
		index: n,
		prepared: {
			name: t.name,
			tick: D(e, t),
			set: Object.entries(t.set ?? {}).flatMap(([e, t]) => {
				let n = O(e);
				return n ? [{
					...n,
					value: t
				}] : [];
			})
		}
	})).sort((e, t) => e.prepared.tick - t.prepared.tick || e.index - t.index).map((e) => e.prepared);
}
function A(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e) for (let e of n.set) {
		let n = `${e.node}.${e.param}`;
		if (r.has(n)) continue;
		let i = t.nodes.find((t) => t.id === e.node)?.params[e.param];
		(typeof i == "number" || typeof i == "string") && r.set(n, {
			node: e.node,
			param: e.param,
			value: i
		});
	}
	for (let t of e) {
		if (t.tick > n) break;
		for (let e of t.set) r.set(`${e.node}.${e.param}`, {
			node: e.node,
			param: e.param,
			value: e.value
		});
	}
	return r;
}
function j(e, t, n, r) {
	if (n === t) return [];
	let i = (e) => n > t ? e > t && e <= n : e > t && e < r.loopEnd || e >= r.introEnd && e <= n;
	return e.filter((e) => i(e.tick)).map((e) => e.name);
}
// packages/comp-core/dist/player/read-exp.js
var M = Object.freeze({
	maxDepth: 32,
	renderMaxNodes: 2e3,
	renderMaxEdges: 6e3,
	paramTextMax: 2e3
}), N = [
	"sphere",
	"cube",
	"plane",
	"torus"
], P = ["materialOutput", "vfxOutput"], F = /^[0-9a-f]{64}$/, I = (e) => typeof e == "object" && !!e && !Array.isArray(e), L = (e) => typeof e == "string" && e.length > 0;
function R(e, t) {
	let n = [[e, 1]];
	for (let e = n.pop(); e; e = n.pop()) {
		let [r, i] = e;
		if (typeof r == "object" && r) {
			if (i > t) return !0;
			for (let e of Object.values(r)) n.push([e, i + 1]);
		}
	}
	return !1;
}
function z(e, t, n) {
	let r = n.length, i = (e, t) => {
		n.push({
			step: "render",
			path: e,
			message: t
		});
	};
	if (!I(e) || e.v !== 1 || !Array.isArray(e.nodes) || !Array.isArray(e.edges)) return i("/render", "render precisa ser { v: 1, nodes, edges }"), null;
	if (e.nodes.length > M.renderMaxNodes && i("/render/nodes", `mais de ${M.renderMaxNodes} nós`), e.edges.length > M.renderMaxEdges && i("/render/edges", `mais de ${M.renderMaxEdges} conexões`), n.length > r) return null;
	let a = /* @__PURE__ */ new Set(), o = !1;
	return e.nodes.forEach((e, r) => {
		let s = `/render/nodes/${r}`;
		if (!I(e) || !L(e.id) || !L(e.type) || !I(e.params)) i(s, "nó precisa de id, type e params");
		else {
			a.has(e.id) && i(`${s}/id`, `id repetido: ${e.id}`), a.add(e.id), e.muted !== void 0 && typeof e.muted != "boolean" && i(`${s}/muted`, "muted precisa ser verdadeiro ou falso"), P.includes(e.type) && (o = !0);
			for (let [r, a] of Object.entries(e.params)) {
				let o = `${s}/params/${r}`;
				typeof a == "number" ? Number.isFinite(a) || i(o, "número não finito") : typeof a == "string" ? a.length > M.paramTextMax ? i(o, `texto com mais de ${M.paramTextMax} caracteres`) : a.startsWith("tex:") && !Object.prototype.hasOwnProperty.call(t, a.slice(4)) ? n.push({
					step: "assets",
					path: o,
					message: "imagem referenciada não está em assets"
				}) : /^https?:/i.test(a) && e.type === "imageTexture" && i(o, "endereço externo de imagem não é aceito") : typeof a != "boolean" && i(o, "parâmetro precisa ser número, texto ou booleano");
			}
		}
	}), e.edges.forEach((e, t) => {
		let n = `/render/edges/${t}`;
		!I(e) || !L(e.source) || !L(e.target) || !L(e.sourceHandle) || !L(e.targetHandle) ? i(n, "conexão precisa de source, sourceHandle, target e targetHandle") : (a.has(e.source) || i(`${n}/source`, `nó inexistente: ${e.source}`), a.has(e.target) || i(`${n}/target`, `nó inexistente: ${e.target}`));
	}), o || i("/render/nodes", "falta um Material Output ou VFX Output"), n.length > r ? null : {
		v: 1,
		nodes: e.nodes.map((e) => ({
			id: e.id,
			type: e.type,
			params: { ...e.params },
			...e.muted === !0 ? { muted: !0 } : {}
		})),
		edges: e.edges.map((e) => ({
			source: e.source,
			sourceHandle: e.sourceHandle,
			target: e.target,
			targetHandle: e.targetHandle
		}))
	};
}
function B(e, t) {
	let n = {};
	if (e === void 0) return n;
	if (!I(e)) return t.push({
		step: "assets",
		path: "/assets",
		message: "assets precisa ser um objeto"
	}), n;
	for (let [r, i] of Object.entries(e)) {
		let e = `/assets/${r}`;
		F.test(r) ? !I(i) || !L(i.mime) || !L(i.data) || !Number.isSafeInteger(i.size) || i.size <= 0 ? t.push({
			step: "assets",
			path: e,
			message: "imagem precisa de mime, size e data"
		}) : n[r] = {
			mime: i.mime,
			size: i.size,
			data: i.data
		} : t.push({
			step: "assets",
			path: e,
			message: "a chave de cada imagem é o sha256 dos bytes"
		});
	}
	return n;
}
function V(e, t) {
	if (e === void 0) return;
	let n = (e, n) => {
		t.push({
			step: "schema",
			path: e,
			message: n
		});
	};
	if (!I(e) || typeof e.mesh != "string" || !N.includes(e.mesh)) n("/stage/mesh", "mesh precisa ser sphere, cube, plane ou torus");
	else {
		for (let t of ["focusY", "distance"]) e[t] !== void 0 && !(typeof e[t] == "number" && Number.isFinite(e[t])) && n(`/stage/${t}`, "precisa ser um número finito");
		return e.env !== void 0 && e.env !== "room" && e.env !== "studio" && n("/stage/env", "env precisa ser studio ou room"), {
			mesh: e.mesh,
			...typeof e.focusY == "number" ? { focusY: e.focusY } : {},
			...typeof e.distance == "number" ? { distance: e.distance } : {},
			...e.env === "room" ? { env: "room" } : {}
		};
	}
}
function H(e, t) {
	let n = B(e.assets, t), i = V(e.stage, t), a = z(e.render, n, t);
	return !a || t.length ? null : {
		format: r,
		version: 2,
		render: a,
		...i ? { stage: i } : {},
		...Object.keys(n).length ? { assets: n } : {}
	};
}
function U(e) {
	return typeof e == "bigint" ? e : typeof e == "number" && Number.isSafeInteger(e) || typeof e == "string" && /^-?\d+$/.test(e) ? BigInt(e) : null;
}
function ee(e, t, n) {
	let r = (e, t) => {
		n.push({
			step: "composition",
			path: e,
			message: t
		});
	};
	if (!I(e)) return r("/composition", "composition precisa ser um objeto"), null;
	e.version !== 3 && r("/composition/version", "a composição precisa declarar version 3"), L(e.id) || r("/composition/id", "falta o id"), typeof e.name != "string" && r("/composition/name", "falta o nome");
	for (let t of [
		"tracks",
		"clips",
		"markers"
	]) Array.isArray(e[t]) || r(`/composition/${t}`, "precisa ser uma lista");
	let i = e.sections;
	I(i) && [
		"introEnd",
		"loopEnd",
		"duration"
	].every((e) => Number.isSafeInteger(i[e]) && i[e] >= 0) || r("/composition/sections", "sections precisa de introEnd, loopEnd e duration em ticks inteiros");
	let a = e.frameRate, s = I(a) ? U(a.numerator) : null, l = I(a) ? U(a.denominator) : null;
	(s === null || l === null || s <= 0n || l <= 0n) && r("/composition/frameRate", "frameRate precisa de numerator e denominator inteiros positivos");
	let u = {};
	if (e.sources !== void 0) {
		if (!I(e.sources)) r("/composition/sources", "sources precisa ser um objeto");
		else for (let [i, a] of Object.entries(e.sources)) {
			let e = `/composition/sources/${i}`;
			if (!I(a) || a.kind !== "graph") {
				r(e, "fonte precisa ser { kind: \"graph\", render }");
				continue;
			}
			let o = [], s = z(a.render, t, o);
			for (let t of o) n.push({
				step: t.step,
				path: e + t.path,
				message: t.message
			});
			s && (u[i] = {
				kind: "graph",
				render: s,
				...Array.isArray(a.assets) ? { assets: a.assets.filter(L) } : {}
			});
		}
	}
	if (Array.isArray(e.clips) && e.clips.forEach((e, t) => {
		if (!I(e)) return;
		let n = `/composition/clips/${t}`, i = e.source;
		if (I(i) && i.sourceId !== void 0 && (i.kind === "effect" ? L(i.sourceId) && Object.prototype.hasOwnProperty.call(u, i.sourceId) || r(`${n}/source/sourceId`, `fonte inexistente: ${String(i.sourceId)}`) : r(`${n}/source/kind`, "só clipe de efeito aponta para uma fonte")), e.seed !== void 0 && !Number.isSafeInteger(e.seed) && r(`${n}/seed`, "seed precisa ser um inteiro"), e.in !== void 0 && !Number.isSafeInteger(e.in) && r(`${n}/in`, "in precisa ser um número inteiro de ticks"), e.speed !== void 0 && !(typeof e.speed == "number" && Number.isFinite(e.speed) && e.speed > 0) && r(`${n}/speed`, "speed precisa ser um número maior que zero"), e.loop !== void 0 && ![
			"repeat",
			"hold",
			"once"
		].includes(e.loop) && r(`${n}/loop`, "loop precisa ser repeat, hold ou once"), e.burst !== void 0 && !(Number.isSafeInteger(e.burst) && e.burst > 0) && r(`${n}/burst`, "burst precisa ser um número inteiro de ticks maior que zero"), e.events !== void 0) {
			let t = I(i) && L(i.sourceId) ? u[i.sourceId]?.render : void 0, a = Number.isSafeInteger(e.end) && Number.isSafeInteger(e.start) ? e.end - e.start : null, o = new Set(Object.keys(I(e.curves) ? e.curves : {}).map((e) => C(e)).filter(Boolean).map((e) => `${e.node}.${e.param}`));
			Array.isArray(e.events) ? e.events.forEach((e, i) => {
				let s = `${n}/events/${i}`;
				if (!I(e)) {
					r(s, "evento precisa ser um objeto");
					return;
				}
				L(e.name) || r(`${s}/name`, "evento precisa de nome");
				let c = e.at;
				if (!I(c) || ![
					"afterStart",
					"beforeEnd",
					"percent"
				].includes(c.space) ? r(`${s}/at`, "at precisa de space: afterStart, beforeEnd ou percent") : (c.space === "percent" ? !(typeof c.value == "number" && c.value >= 0 && c.value <= 100) : !(Number.isSafeInteger(c.value) && c.value >= 0 && (a === null || c.value <= a))) && r(`${s}/at/value`, c.space === "percent" ? "percent vai de 0 a 100" : "instante em ticks inteiros, dentro do clipe"), e.set !== void 0) {
					if (!I(e.set)) {
						r(`${s}/set`, "set precisa ser um objeto");
						return;
					}
					if (!t) {
						r(`${s}/set`, "set só vale em clipe de efeito com fonte embutida");
						return;
					}
					for (let [n, i] of Object.entries(e.set)) {
						let e = O(n), a = e ? t.nodes.find((t) => t.id === e.node) : void 0;
						!e || !a || !Object.prototype.hasOwnProperty.call(a.params ?? {}, e.param) ? r(`${s}/set/${n}`, `alvo inexistente na fonte: ${n}`) : o.has(n) && r(`${s}/set/${n}`, `o alvo já é animado por um canal: ${n}`), typeof i != "number" && typeof i != "string" && r(`${s}/set/${n}`, "valor precisa ser número ou texto");
					}
				}
			}) : r(`${n}/events`, "events precisa ser uma lista");
		}
		for (let t of ["blendIn", "blendOut"]) e[t] !== void 0 && !(Number.isSafeInteger(e[t]) && e[t] >= 0) && r(`${n}/${t}`, `${t} precisa ser um número inteiro de ticks, zero ou mais`);
		if (Number.isSafeInteger(e.blendIn) && Number.isSafeInteger(e.blendOut) && Number.isSafeInteger(e.start) && Number.isSafeInteger(e.end) && e.blendIn + e.blendOut > e.end - e.start && r(`${n}/blendOut`, "entrada e saída juntas passam da duração do clipe"), I(e.curves)) {
			let t = I(i) && L(i.sourceId) ? u[i.sourceId]?.render : void 0;
			for (let i of Object.keys(e.curves)) {
				if (!i.startsWith("param.")) continue;
				let e = C(i);
				if (!e) {
					r(`${n}/curves/${i}`, "canal de parâmetro precisa ser param.<nó>.<parâmetro>");
					continue;
				}
				if (!t) {
					r(`${n}/curves/${i}`, "canal de parâmetro só vale em clipe de efeito com fonte embutida");
					continue;
				}
				let a = t.nodes.find((t) => t.id === e.node);
				a && Object.prototype.hasOwnProperty.call(a.params ?? {}, e.param) || r(`${n}/curves/${i}`, `alvo inexistente na fonte: ${e.node}.${e.param}`);
			}
		}
	}), n.length || s === null || l === null) return null;
	let d = {
		...e,
		frameRate: c(s, l),
		...e.sources === void 0 ? {} : { sources: u }
	};
	try {
		S(d);
	} catch (e) {
		return r("/composition", e instanceof o ? `${e.code}: ${e.message}` : e instanceof Error ? e.message : String(e)), null;
	}
	return d;
}
function te(e) {
	let t = e;
	if (typeof e == "string") try {
		t = JSON.parse(e);
	} catch (e) {
		return a([{
			step: "json",
			path: "",
			message: e instanceof Error ? e.message : "JSON inválido"
		}]);
	}
	if (R(t, M.maxDepth)) return a([{
		step: "depth",
		path: "",
		message: `mais de ${M.maxDepth} níveis de aninhamento`
	}]);
	if (!I(t) || t.format !== "expctral.exp") return a([{
		step: "format",
		path: "/format",
		message: `format precisa ser "${r}"`
	}]);
	if (t.version === 1) return a([{
		step: "version",
		path: "/version",
		message: "o .exp v1 leva WGSL compilado, que o núcleo não executa"
	}]);
	if (t.version !== 2 && t.version !== 3) return a([{
		step: "version",
		path: "/version",
		message: "versão desconhecida; o núcleo lê .exp v2 e v3"
	}]);
	let n = [];
	if (t.version === 2) {
		let e = H(t, n);
		return e ? i(e) : a(n);
	}
	let o = B(t.assets, n), s = ee(t.composition, o, n);
	return !s || n.length ? a(n) : i({
		format: r,
		version: 3,
		composition: s,
		...Object.keys(o).length ? { assets: o } : {}
	});
}
var W = "exp-v2-track", G = "exp-v2-clip";
function K(e, t) {
	let { durationTicks: n } = t;
	if (!Number.isSafeInteger(n) || n <= 0) throw RangeError("durationTicks must be a positive integer number of ticks");
	if (e.version !== 2) throw TypeError("compositionFromV2 expects an .exp v2 package");
	let r = W, i = G;
	return {
		version: 3,
		id: t.id ?? "exp-v2",
		name: t.id ?? "exp-v2",
		frameRate: c(t.frameRate.numerator, t.frameRate.denominator),
		sections: {
			introEnd: 0,
			loopEnd: n,
			duration: n
		},
		tracks: [{
			id: r,
			name: "Efeito",
			kind: "prism"
		}],
		clips: [{
			id: i,
			trackId: r,
			start: 0,
			end: n,
			source: { kind: "effect" }
		}],
		markers: []
	};
}
// packages/comp-core/dist/player/session-clock.js
var ne = 3, q = Object.freeze({ now: () => Date.now() });
function J(e, t) {
	if (!Number.isFinite(e.t0) || !Number.isFinite(t)) throw RangeError("Session t0 and clock reading must be finite milliseconds");
	let n = t - e.t0;
	if (n <= 0) return 0;
	let r = Math.floor(n * ne / 5);
	if (!Number.isSafeInteger(r)) throw RangeError("Session tick exceeds the safe integer range");
	return r;
}
function Y(e, t) {
	let n = e + t;
	if (!Number.isSafeInteger(e) || !Number.isSafeInteger(t) || !Number.isSafeInteger(n)) throw RangeError("Seeds must be safe integers");
	return n;
}
// packages/comp-core/dist/runtime/clock.js
var X = 1e9, re = 2 ** 53 - 1;
function Z(e) {
	if (!Number.isFinite(e)) throw RangeError("Elapsed seconds must be finite.");
	let t = Math.round(e * X);
	if (!Number.isSafeInteger(t)) throw RangeError("Elapsed nanoseconds exceed the safe integer range.");
	return t;
}
function Q(e) {
	if (!Number.isSafeInteger(e)) throw RangeError("Runtime clock exceeded the safe Tick range.");
	return e;
}
var ie = class {
	epochTick;
	elapsedNanoseconds = 0;
	lastTick;
	constructor(e = 0) {
		this.epochTick = e, this.lastTick = e;
	}
	get tick() {
		return this.lastTick;
	}
	get elapsedNs() {
		return BigInt(this.elapsedNanoseconds);
	}
	advanceSeconds(e) {
		let t = Z(e), n = this.elapsedNanoseconds + t;
		if (!Number.isSafeInteger(n) || Math.abs(n) > re) throw RangeError("Runtime clock exceeded the safe nanosecond accumulator; synchronize the epoch.");
		let r = Math.trunc(n / X), i = n - r * X, a = r * 600 + Math.trunc(i * 600 / X), o = Q(this.epochTick + a);
		return this.elapsedNanoseconds = n, this.lastTick = o, this.lastTick;
	}
	syncEpoch(e, t) {
		this.epochTick = e, this.elapsedNanoseconds = Z(t);
		let n = Math.trunc(this.elapsedNanoseconds / X), r = this.elapsedNanoseconds - n * X;
		return this.lastTick = Q(e + n * 600 + Math.trunc(r * 600 / X)), this.lastTick;
	}
	reset(e = 0) {
		this.epochTick = e, this.elapsedNanoseconds = 0, this.lastTick = e;
	}
};
// packages/comp-core/dist/portable/kernel.js
function ae() {
	let e = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8)), t = {}, n = /* @__PURE__ */ new WeakMap();
	function r(e, t) {
		return Math.imul((e ^ t) >>> 0, 16777619) >>> 0;
	}
	function i(t, n) {
		e.setFloat64(0, n, !0);
		for (let n = 0; n < 8; n++) t = r(t, e.getUint8(n));
		return t;
	}
	function a(e, t, n, r, i) {
		let a = 1 - i;
		return a * a * a * e + 3 * a * a * i * t + 3 * a * i * i * n + i * i * i * r;
	}
	function o(e, t, n, r, i) {
		let a = 1 - i;
		return 3 * a * a * (t - e) + 6 * a * i * (n - t) + 3 * i * i * (r - n);
	}
	function s(e, t) {
		return (e % t + t) % t;
	}
	function c(e, t, n, r, i, s, c, l, u, d) {
		if (d <= e) return n;
		if (d >= t) return r;
		let f = t - e;
		if (f <= 0) return r;
		let p = (d - e) / f;
		if (i === 0) return n;
		if (i === 1) return n + (r - n) * p;
		if (i === 2) {
			let i = 0, f = 1, m = p;
			for (let n = 0; n < 24; n++) {
				let n = a(e, s, l, t, m) - d;
				if (Math.abs(n) < 1e-9) break;
				n < 0 ? i = m : f = m;
				let r = o(e, s, l, t, m), c = Math.abs(r) > 1e-12 ? m - n / r : NaN;
				m = Number.isFinite(c) && c > i && c < f ? c : (i + f) * .5;
			}
			return a(n, c, u, r, m);
		}
		let m = c, h = u, g = p * p, _ = g * p;
		return (2 * _ - 3 * g + 1) * n + (_ - 2 * g + p) * f * m + (-2 * _ + 3 * g) * r + (_ - g) * f * h;
	}
	function l(e, t, n) {
		let r = e.curveKeyOffsets[t] ?? 0, i = e.curveKeyCounts[t] ?? 0;
		if (!i) return 0;
		let a = r, o = r + i - 1, l = e.keyTicks[a] ?? 0, u = e.keyTicks[o] ?? 0;
		if (i === 1) return e.keyValues[a] ?? 0;
		let d = n;
		if (d < l || d > u) {
			let n = d < l, r = n ? e.curvePreExtrapolations[t] ?? 0 : e.curvePostExtrapolations[t] ?? 0;
			if (r === 0) return e.keyValues[n ? a : o] ?? 0;
			if (r === 1) {
				let t = n ? a : o - 1, r = t + 1, i = n ? a : o, s = e.keyValues[i] ?? 0, c = e.keyValues[n ? r : t] ?? 0, l = e.keyTicks[i] ?? 0, u = n ? e.keyOutHandles[t * 2] ?? 0 : e.keyInHandles[r * 2] ?? 0, f = n ? e.keyOutHandles[t * 2 + 1] ?? 0 : e.keyInHandles[r * 2 + 1] ?? 0, p = Math.abs(u - l) > 1e-9 ? n ? (f - s) / (u - l) : (s - f) / (l - u) : (c - s) / ((e.keyTicks[n ? r : t] ?? 0) - l || 1);
				return s + (d - l) * p;
			}
			let i = u - l;
			if (i <= 0) return e.keyValues[a] ?? 0;
			let c = r === 2 ? i : i * 2, f = s(d - l, c);
			d = l + (r === 2 || f <= i ? f : c - f);
		}
		if (d <= l) return e.keyValues[a] ?? 0;
		if (d >= u) return e.keyValues[o] ?? 0;
		let f = 0, p = i - 1;
		for (; f + 1 < p;) {
			let t = f + p >>> 1;
			(e.keyTicks[r + t] ?? 0) <= d ? f = t : p = t;
		}
		let m = r + f, h = m + 1, g = e.keyTicks[m] ?? 0, _ = e.keyTicks[h] ?? 0, v = e.keyValues[m] ?? 0, y = e.keyValues[h] ?? 0, b = e.keyModes[m] ?? 1, x = e.keyOutHandles[m * 2] ?? g, S = e.keyOutHandles[m * 2 + 1] ?? v, C = e.keyInHandles[h * 2] ?? _, w = e.keyInHandles[h * 2 + 1] ?? y;
		return b === 2 && (x === g && S === v && (x = g + (_ - g) / 3), C === _ && w === y && (C = g + 2 * (_ - g) / 3)), b === 3 && (x === g && S === v && (S = (y - v) / (_ - g || 1)), C === _ && w === y && (w = (y - v) / (_ - g || 1))), c(g, _, v, y, b, x, S, C, w, d);
	}
	function u(e, t) {
		if (!e.length) return t;
		let n = e[0], r = e[e.length - 1];
		if (t <= n.tick) return typeof n.value == "number" ? n.value : 0;
		if (t >= r.tick) return typeof r.value == "number" ? r.value : 0;
		let i = n, a = r;
		for (let n = 1; n < e.length; n++) {
			let r = e[n];
			if (t <= r.tick) {
				a = r;
				break;
			}
			i = r;
		}
		let o = typeof i.value == "number" ? i.value : 0, s = typeof a.value == "number" ? a.value : 0, l = a.tick - i.tick, u = i.outHandle, d = a.inHandle, f = typeof u?.[0] == "number" ? u[0] : i.tick + l / 3, p = typeof d?.[0] == "number" ? d[0] : i.tick + 2 * l / 3, m = typeof u?.[1] == "number" ? u[1] : i.mode === "hermite" ? (s - o) / (l || 1) : o, h = typeof d?.[1] == "number" ? d[1] : i.mode === "hermite" ? (s - o) / (l || 1) : s;
		return c(i.tick, a.tick, o, s, i.mode === "step" ? 0 : i.mode === "linear" ? 1 : i.mode === "bezier" ? 2 : 3, f, m, p, h, t);
	}
	function d(e, t, n) {
		let r = Math.max(0, Math.trunc(e));
		if (n !== null && r >= n || r <= t.loopEnd) return Math.min(r, t.duration);
		let i = t.loopEnd - t.introEnd;
		return i <= 0 ? t.loopEnd : t.introEnd + s(r - t.introEnd, i);
	}
	function f(e) {
		return {
			tick: 0,
			localTick: 0,
			digest: 0,
			visualDigest: 0,
			unchanged: !1,
			values: new Float64Array(e.clips.length),
			curveValues: new Float64Array(e.curveTables.curveKeyCounts.length),
			crossedMarkers: [],
			releaseTick: null
		};
	}
	function p(e, t) {
		let n = d(t.tick, e.sections, t.releaseTick);
		t.localTick = n;
		for (let r = 0; r < e.clips.length; r++) {
			let i = e.clips[r], a = i.timeRemap ? u(i.timeRemap, n) : n;
			t.values[r] = +(a >= i.resolvedStart && a <= i.resolvedEnd);
		}
		let r = e.curveTables;
		for (let e = 0; e < r.curveKeyCounts.length; e++) t.curveValues[e] = l(r, e, n);
		let a = 2166136261;
		for (let e = 0; e < t.values.length; e++) a = i(a, t.values[e] ?? 0);
		for (let e = 0; e < t.curveValues.length; e++) a = i(a, t.curveValues[e] ?? 0);
		(typeof e.stage?.camera?.trauma == "number" && e.stage.camera.trauma > 0 || e.curveTables.curveSlots.includes(107)) && typeof e.stage?.camera?.seed != "number" && (a = i(a, t.tick));
		for (let t = 0; t < e.clips.length; t++) {
			let r = e.clips[t];
			for (let e = 1; e <= (r.timeEcho?.count ?? 0); e++) {
				let t = n - e, o = r.timeRemap ? u(r.timeRemap, t) : t;
				a = i(a, +(o >= r.resolvedStart && o <= r.resolvedEnd));
			}
		}
		return t.unchanged = a === t.visualDigest && t.crossedMarkers.length === 0, t.visualDigest = a, t.digest = i(i(2166136261, t.tick), a), t;
	}
	function m(e) {
		let t = 0;
		for (let n of e.clips) t += 1 + (n.timeEcho?.count ?? 0);
		t = Math.max(1, t);
		let r = {
			transformInstances: new Float32Array(t * 20),
			transformInstanceMeta: new Uint32Array(t * 4),
			cameraUniforms: /* @__PURE__ */ new Float32Array(32),
			lightPostUniforms: /* @__PURE__ */ new Float32Array(24),
			effectInstances: new Float32Array(t * 16)
		};
		return n.set(r, {
			props: new Float32Array(e.clips.length * 20),
			locals: new Float32Array(e.clips.length * 16),
			worlds: new Float32Array(e.clips.length * 16),
			opacities: new Float32Array(e.clips.length),
			stage: /* @__PURE__ */ new Float32Array(32)
		}), r;
	}
	function h(e, t, n, r) {
		if (Array.isArray(n)) for (let i = 0; i < r; i++) typeof n[i] == "number" && (e[t + i] = n[i]);
	}
	function g(e, t, n, r) {
		let i = e[t] ?? 0, a = e[t + 1] ?? 0, o = e[t + 2] ?? 0, s = e[t + 3] ?? 1, c = e[t + 4] ?? 1, l = e[t + 5] ?? 1, u = e[t + 6] ?? 0, d = e[t + 7] ?? 0, f = e[t + 8] ?? 0, p = Math.cos(u), m = Math.sin(u), h = Math.cos(d), g = Math.sin(d), _ = Math.cos(f), v = Math.sin(f);
		n[r] = _ * h * s, n[r + 1] = v * h * s, n[r + 2] = -g * s, n[r + 3] = 0, n[r + 4] = (_ * g * m - v * p) * c, n[r + 5] = (v * g * m + _ * p) * c, n[r + 6] = h * m * c, n[r + 7] = 0, n[r + 8] = (_ * g * p + v * m) * l, n[r + 9] = (v * g * p - _ * m) * l, n[r + 10] = h * p * l, n[r + 11] = 0, n[r + 12] = i, n[r + 13] = a, n[r + 14] = o, n[r + 15] = 1;
	}
	function _(e, t, n, r, i, a) {
		for (let o = 0; o < 4; o++) for (let s = 0; s < 4; s++) {
			let c = 0;
			for (let i = 0; i < 4; i++) c += (e[t + i * 4 + s] ?? 0) * (n[r + o * 4 + i] ?? 0);
			i[a + o * 4 + s] = c;
		}
	}
	function v(e) {
		let t = Math.imul((e | 0) ^ 2654435769, 2246822507);
		return t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, (t >>> 0) / 4294967295 * 2 - 1;
	}
	function y(e, t, n) {
		let r = t[0] ?? 0, i = t[1] ?? 0, a = t[2] ?? 5, o = r - (t[3] ?? 0), s = i - (t[4] ?? 0), c = a - (t[5] ?? 0), l = Math.hypot(o, s, c) || 1;
		o /= l, s /= l, c /= l;
		let u = Math.cos(n), d = Math.sin(n), f = 0, p = u * o + d * s + f * c;
		u -= p * o, d -= p * s, f -= p * c, l = Math.hypot(u, d, f) || 1, u /= l, d /= l, f /= l;
		let m = s * f - c * d, h = c * u - o * f, g = o * d - s * u;
		l = Math.hypot(m, h, g) || 1, m /= l, h /= l, g /= l, e[0] = u, e[1] = m, e[2] = o, e[3] = 0, e[4] = d, e[5] = h, e[6] = s, e[7] = 0, e[8] = f, e[9] = g, e[10] = c, e[11] = 0, e[12] = -(u * r + d * i + f * a), e[13] = -(m * r + h * i + g * a), e[14] = -(o * r + s * i + c * a), e[15] = 1;
	}
	function b(e, r, i) {
		let a = n.get(i);
		if (!a) throw Error("Track buffers must be allocated with createTrackBufferSet");
		let { props: o, locals: s, worlds: c, opacities: l, stage: d } = a, f = e.clips;
		for (let e = 0; e < f.length; e++) {
			let n = f[e], r = e * 20, i = n.overrides ?? t;
			for (let e = 0; e < 20; e++) o[r + e] = 0;
			o[r + 3] = 1, o[r + 4] = 1, o[r + 5] = 1, o[r + 9] = i.opacity === null ? 0 : typeof i.opacity == "number" ? i.opacity : 1, o[r + 10] = 1, o[r + 11] = 1, o[r + 12] = 1, o[r + 13] = 1, h(o, r, i.position, 3), h(o, r + 3, i.scale, 3), h(o, r + 6, i.rotation, 3), h(o, r + 10, i.color, 4), h(o, r + 14, i.uvOffset, 2), h(o, r + 16, i.customParams, 4);
		}
		for (let e = 0; e < 32; e++) d[e] = 0;
		let p = e.stage?.camera ?? t, m = e.stage?.light ?? t, b = e.stage?.post ?? t;
		d[2] = 5, d[6] = 0, d[8] = typeof p.fov == "number" ? p.fov : 50, d[9] = typeof p.trauma == "number" ? p.trauma : 0, d[10] = typeof p.roll == "number" ? p.roll : 0, d[11] = typeof p.near == "number" ? p.near : .1, d[12] = typeof p.far == "number" ? p.far : 100, d[13] = typeof p.aspect == "number" ? p.aspect : 16 / 9, d[23] = 1, d[24] = 1, d[25] = 1, d[14] = typeof m.intensity == "number" ? m.intensity : 1, d[15] = typeof m.exposure == "number" ? m.exposure : 0, d[16] = typeof b.exposure == "number" ? b.exposure : d[15] ?? 0, d[17] = typeof b.bloom == "number" ? b.bloom : 0, d[18] = typeof b.vignette == "number" ? b.vignette : 0, d[19] = typeof b.chromaticAberration == "number" ? b.chromaticAberration : 0, h(d, 0, p.position, 3), h(d, 3, p.target, 3), h(d, 20, m.direction, 3), h(d, 23, m.color, 3);
		let x = e.curveTables;
		for (let e = 0; e < x.curveSlots.length; e++) {
			let t = x.curveSlots[e] ?? -1;
			if (t < 0) continue;
			let n = x.curveClipIndices[e] ?? -1, i = r.curveValues[e] ?? 0;
			n >= 0 && t < 20 ? o[n * 20 + t] = i : n < 0 && (t >= 100 && t <= 105 ? d[t - 100] = i : t === 106 ? d[8] = i : t === 107 ? d[9] = i : t >= 110 && t <= 112 ? d[20 + t - 110] = i : t >= 113 && t <= 115 ? d[23 + t - 113] = i : t === 116 ? d[14] = i : t >= 117 && t <= 120 && (d[16 + t - 117] = i));
		}
		for (let e = 0; e < f.length; e++) {
			let n = f[e], r = e * 16, i = (n.overrides ?? t).transform;
			if (Array.isArray(i) && i.length === 16) for (let e = 0; e < 16; e++) s[r + e] = Number(i[e]);
			else g(o, e * 20, s, r);
			let a = n.parentClipIndex;
			if (a >= 0) _(c, a * 16, s, r, c, r);
			else for (let e = 0; e < 16; e++) c[r + e] = s[r + e] ?? 0;
			l[e] = (o[e * 20 + 9] ?? 1) * (n.inheritOpacity && a >= 0 ? l[a] ?? 1 : 1);
		}
		let S = i.cameraUniforms, C = i.lightPostUniforms;
		S.fill(0), C.fill(0), y(S, d, d[10] ?? 0);
		let w = Math.max(0, d[9] ?? 0), T = w * w, E = typeof p.seed == "number" ? p.seed : r.tick, D = v(E) * T, O = v(E + 1) * T;
		S[12] = (S[12] ?? 0) + D, S[13] = (S[13] ?? 0) + O;
		let k = Math.max(.001, d[11] ?? .1), A = Math.max(k + .001, d[12] ?? 100), j = Math.max(1, Math.min(179, d[8] ?? 50)), M = Math.max(.01, d[13] ?? 16 / 9), N = 1 / Math.tan(j * Math.PI / 360);
		S[16] = N / M, S[21] = N, S[26] = A / (k - A), S[27] = -1, S[30] = k * A / (k - A), C[0] = d[20] ?? 0, C[1] = d[21] ?? 0, C[2] = d[22] ?? 0, C[3] = d[14] ?? 1, C[4] = d[23] ?? 0, C[5] = d[24] ?? 0, C[6] = d[25] ?? 0, C[7] = .2, C[8] = d[16] ?? 0, C[9] = d[17] ?? 0, C[10] = d[18] ?? 0, C[11] = d[19] ?? 0, C[16] = d[0] ?? 0, C[17] = d[1] ?? 0, C[18] = d[2] ?? 5, C[19] = j, C[20] = k, C[21] = A, C[22] = D, C[23] = O;
		let P = 0;
		for (let e = 0; e < f.length; e++) {
			let t = f[e], n = e * 20, a = t.timeEcho?.count ?? 0;
			for (let s = 0; s <= a; s++) {
				let a = P * 20;
				for (let t = 0; t < 16; t++) i.transformInstances[a + t] = c[e * 16 + t] ?? 0;
				let d = r.localTick - s, f = t.timeRemap ? u(t.timeRemap, d) : d, p = s === 0 ? r.values[e] ?? 0 : +(f >= t.resolvedStart && f <= t.resolvedEnd), m = s === 0 ? 1 : Math.max(0, Math.min(1, t.timeEcho?.decay ?? 0)) ** +s, h = p * (l[e] ?? 1) * m;
				i.transformInstances[a + 16] = h, i.transformInstances[a + 17] = p, i.transformInstances[a + 18] = e, i.transformInstances[a + 19] = s, i.transformInstanceMeta[P * 4] = e, i.transformInstanceMeta[P * 4 + 1] = s, i.transformInstanceMeta[P * 4 + 2] = t.parentClipIndex + 1, i.transformInstanceMeta[P * 4 + 3] = 0;
				let g = P * 16;
				for (let e = 0; e < 16; e++) i.effectInstances[g + e] = 0;
				i.effectInstances[g] = h, i.effectInstances[g + 1] = (t.timeEcho?.scale ?? 1) ** +s;
				for (let e = 0; e < 4; e++) i.effectInstances[g + 2 + e] = o[n + 10 + e] ?? 1;
				for (let e = 0; e < 2; e++) i.effectInstances[g + 6 + e] = o[n + 14 + e] ?? 0;
				for (let e = 0; e < 4; e++) i.effectInstances[g + 8 + e] = o[n + 16 + e] ?? 0;
				P++;
			}
		}
	}
	function x(e) {
		return {
			frame: f(e),
			buffers: m(e)
		};
	}
	return {
		makeFrame: f,
		evaluateFrame: p,
		makeBuffers: m,
		evaluateTrackBuffers: b,
		createState: x,
		flatCurve: l,
		fold: d
	};
}
// packages/comp-core/dist/evaluator/evaluate.js
var oe = ae();
function se(e, t) {
	oe.evaluateFrame(e, t);
}
// packages/comp-core/dist/runtime/session.js
var ce = class {
	compiled;
	tick = 0;
	state = "stopped";
	previousVisual = 0;
	clock = new ie();
	releaseAt = null;
	frameBuffer;
	disposed = !1;
	constructor(e) {
		this.compiled = e, this.frameBuffer = {
			tick: 0,
			localTick: 0,
			digest: 0,
			visualDigest: 0,
			unchanged: !1,
			values: new Float64Array(e.clips.length),
			curveValues: new Float64Array(e.curveTables.curveKeyCounts.length),
			crossedMarkers: [],
			releaseTick: null
		};
	}
	play() {
		this.assert(), this.state = "playing";
	}
	pause() {
		this.assert(), this.state = "paused";
	}
	release() {
		this.assert(), this.state = "released", this.releaseAt = this.tick;
	}
	reset() {
		this.assert(), this.tick = 0, this.clock.reset(), this.releaseAt = null, this.state = "stopped", this.update(this.tick, !1);
	}
	seek(e) {
		if (this.assert(), !Number.isSafeInteger(e) || e < 0) throw RangeError("Invalid tick");
		this.tick = e, this.clock.reset(e), this.update(this.tick, !1);
	}
	stepTick(e = 1) {
		this.assert();
		let t = this.tick;
		if (!Number.isSafeInteger(e) || !Number.isSafeInteger(this.tick + e) || this.tick + e < 0) throw RangeError("Invalid step");
		return this.tick += e, this.clock.reset(this.tick), this.update(t, !0), this.frameBuffer;
	}
	advanceSeconds(e) {
		if (this.assert(), !Number.isFinite(e) || e < 0) throw RangeError("Invalid delta");
		if (this.state === "playing" || this.state === "released") {
			let t = this.tick;
			this.tick = this.clock.advanceSeconds(e), this.update(t, !0);
		} else this.update(this.tick, !1);
		return this.frameBuffer;
	}
	getTick() {
		return this.tick;
	}
	getState() {
		return this.state;
	}
	dispose() {
		this.disposed = !0, this.state = "stopped";
	}
	update(e, t) {
		if (this.frameBuffer.tick = this.tick, this.frameBuffer.releaseTick = this.releaseAt, this.frameBuffer.crossedMarkers.length = 0, t && this.tick >= e) for (let t of this.compiled.markers) t.tick > e && t.tick <= this.tick && this.frameBuffer.crossedMarkers.push(t.id);
		se(this.compiled, this.frameBuffer), this.previousVisual = this.frameBuffer.visualDigest;
	}
	assert() {
		if (this.disposed) throw Error("RuntimeSession disposed");
	}
};
function le(e) {
	return new ce(e);
}
// packages/comp-core/dist/tracks/buffers.js
var ue = ae();
function de(e) {
	return ue.makeBuffers(e);
}
function fe(e, t, n) {
	ue.evaluateTrackBuffers(e, t, n);
}
// packages/comp-core/dist/player/player.js
var $ = 600, pe = 1e9;
function me(e) {
	let t = 0;
	for (let n of e.nodes) {
		if (n.type !== "vfxOutput") continue;
		let e = n.params?.count;
		typeof e == "number" && Number.isFinite(e) && e > 0 && (t += e);
	}
	return t;
}
var he = 5 / 3;
function ge(e, t) {
	let n = e.curveTables, r = /* @__PURE__ */ new Map();
	return n.curvePaths.forEach((e, i) => {
		if (n.curveClipIndices[i] !== t) return;
		let a = w(e);
		if (!a) return;
		let o = `${a.target.node}.${a.target.param}`, s = r.get(o) ?? {
			node: a.target.node,
			param: a.target.param,
			scalar: -1,
			parts: [
				-1,
				-1,
				-1
			]
		};
		a.component < 0 ? s.scalar = i : a.component < 3 && (s.parts[a.component] = i), r.set(o, s);
	}), [...r.values()].map((e) => ({
		node: e.node,
		param: e.param,
		scalar: e.scalar,
		rgb: e.parts.every((e) => e >= 0) ? [
			e.parts[0],
			e.parts[1],
			e.parts[2]
		] : null,
		last: null
	}));
}
function _e(e, t) {
	if (t < e.resolvedStart || t > e.resolvedEnd) return 0;
	let n = t - e.resolvedStart, r = e.resolvedEnd - t, i = (e.blendIn ?? 0) > 0 ? Math.min(1, n / e.blendIn) : 1, a = (e.blendOut ?? 0) > 0 ? Math.min(1, r / e.blendOut) : 1;
	return Math.max(0, Math.min(i, a));
}
function ve(e, t) {
	let n = e.in ?? 0, r = e.speed ?? 1, i = n / $, a = (t) => ((t - e.resolvedStart) * r + n) / $;
	switch (e.loop ?? "repeat") {
		case "once": {
			let t = (e.burst ?? 60) * r;
			return {
				start: i,
				end: (n + t) / $,
				burst: t / $
			};
		}
		case "hold": return {
			start: i,
			end: t === null ? pe : Math.max(i, a(t)),
			burst: 0
		};
		default: return {
			start: i,
			end: a(e.resolvedEnd),
			burst: 0
		};
	}
}
function ye(e, t) {
	let n = e.instanceOf[t];
	if (n === void 0) return 1;
	let r = e.buffers.transformInstances[n * 20 + 16];
	return r === void 0 ? 1 : Math.max(0, Math.min(1, r));
}
function be(e) {
	let t = e.clock ?? q, n = /* @__PURE__ */ new Map(), r = null, i = !1, a = !1, o = 0, s = {
		t0: 0,
		seed: 0
	}, c = 0, l = () => {
		if (i) throw Error("Player disposed");
	}, u = () => {
		if (l(), !r) throw Error("Player has no package loaded");
		return r;
	}, d = () => {
		if (r) {
			for (let e of r.layers) e.layer.dispose();
			r.runtime.dispose(), r = null, a = !1;
		}
	}, f = (t) => {
		let n = t.runtime.frameBuffer;
		fe(t.compiled, n, t.buffers);
		for (let [e, r] of t.layers.entries()) {
			let i = t.compiled.clips[r.clipIndex];
			if (!i) continue;
			r.active = n.values[r.clipIndex] === 1;
			let a = i.in ?? 0, o = i.speed ?? 1;
			if (t.continuous) r.layer.clock.value = (n.tick + a) / $, r.layer.emit.start.value = -1e9, r.layer.emit.end.value = pe;
			else {
				r.layer.clock.value = ((n.localTick - i.resolvedStart) * o + a) / $;
				let e = ve(i, n.releaseTick === null ? null : Math.min(n.releaseTick, t.compiled.sections.duration));
				r.layer.emit.start.value = e.start, r.layer.emit.end.value = e.end, r.layer.emit.burst && (r.layer.emit.burst.value = e.burst);
			}
			r.layer.seed.value = Y(i.seed ?? 0, s.seed);
			let c = _e(i, n.localTick) * ye(t, r.clipIndex);
			r.layer.opacity && (r.layer.opacity.value = c);
			let l = t.counts[e];
			if (l && r.cost > 0 && ((i.blendIn ?? 0) > 0 || (i.blendOut ?? 0) > 0)) {
				let e = Math.round(l.base * c);
				e !== l.last && (l.last = e, r.layer.setCount(e));
			}
			for (let i of t.params[e] ?? []) {
				let e = n.curveValues, t = i.rgb ? E(e[i.rgb[0]] ?? 0, e[i.rgb[1]] ?? 0, e[i.rgb[2]] ?? 0) : i.scalar >= 0 ? e[i.scalar] ?? 0 : null;
				t !== null && t !== i.last && (i.last = t, r.layer.setParam(i.node, i.param, t));
			}
			let u = t.events[e];
			if (u && u.list.length) for (let [e, t] of A(u.list, u.render, n.localTick)) u.sent.get(e) !== t.value && (u.sent.set(e, t.value), r.layer.setParam(t.node, t.param, t.value));
		}
		e.renderer.frame(n.tick, t.buffers, t.layers);
	}, p = (e) => {
		for (let t of [...e]) for (let e of [...n.get(t) ?? []]) e();
	};
	async function m(t) {
		l();
		let n = ++o, a;
		if (t.version === 2) {
			if (!e.v2) throw Error("An .exp v2 package has no duration: provide PlayerOptions.v2");
			a = K(t, e.v2);
		} else a = t.composition;
		let s = S(a), u = [];
		if (t.version === 2 ? u.push({
			clipIndex: s.clips.findIndex((e) => e.id === G),
			clipId: G,
			render: t.render
		}) : s.clips.forEach((e, t) => {
			let n = e.source.kind === "effect" ? e.source.sourceId : void 0;
			if (n === void 0) return;
			let r = a.sources?.[n];
			if (!r) throw Error(`Clip ${String(e.id)} points to a missing source: ${n}`);
			u.push({
				clipIndex: t,
				clipId: String(e.id),
				render: r.render
			});
		}), u.length && !e.layers) throw Error("This package has effect clips: PlayerOptions.layers is required to compile them");
		let f = [], p = () => {
			for (let e of f) e.layer.dispose();
		};
		for (let r of u) {
			let a, c = s.clips[r.clipIndex];
			try {
				a = await e.layers(r.render, {
					clipId: r.clipId,
					assets: t.assets ?? {},
					...(c?.blendIn ?? 0) > 0 || (c?.blendOut ?? 0) > 0 ? { fade: !0 } : {}
				});
			} catch (e) {
				throw p(), e;
			}
			if (n !== o || i) throw a.dispose(), p(), Error("Load superseded by a newer load or by dispose");
			f.push({
				clipId: r.clipId,
				clipIndex: r.clipIndex,
				active: !1,
				layer: a,
				cost: me(r.render)
			});
		}
		d();
		let m = le(s), g = [], _ = 0;
		for (let e of s.clips) g.push(_), _ += 1 + (e.timeEcho?.count ?? 0);
		let v = h(f), y = new Map(u.map((e) => [e.clipIndex, e.render])), b = f.map((e) => ({
			list: k(s.clips[e.clipIndex]),
			render: y.get(e.clipIndex),
			sent: /* @__PURE__ */ new Map()
		}));
		r = {
			compiled: s,
			runtime: m,
			buffers: de(s),
			layers: f,
			continuous: t.version === 2,
			params: f.map((e) => ge(s, e.clipIndex)),
			instanceOf: g,
			counts: v.map((e) => ({
				base: e,
				last: e
			})),
			events: b
		}, c = 0, m.seek(0);
	}
	function h(t) {
		if (e.maxCount === void 0 || t.length === 0) return t.map((e) => e.cost);
		let n = e.maxCount, r = t.reduce((e, t) => e + t.cost, 0);
		if (r <= 0) {
			let e = Math.floor(n / t.length);
			for (let n of t) n.layer.setCount(e);
			return t.map(() => e);
		}
		return t.map((e) => {
			if (e.cost <= 0) return 0;
			let t = Math.floor(n * e.cost / r);
			return e.layer.setCount(t), t;
		});
	}
	return {
		load: m,
		play(e) {
			let n = u(), r = t.now();
			e ? (s = {
				t0: e.t0,
				seed: e.seed
			}, c = 0) : s = {
				t0: r,
				seed: s.seed
			}, e || (c = n.runtime.getTick()), n.runtime.play(), a = !0;
		},
		pause() {
			u().runtime.pause(), a = !1;
		},
		seek(e) {
			u().runtime.seek(e), c = e, s = {
				t0: t.now(),
				seed: s.seed
			};
		},
		release() {
			u().runtime.release();
		},
		frame(e) {
			let t = u();
			t.runtime.seek(e), f(t);
		},
		on(e, t) {
			l();
			let r = n.get(e) ?? /* @__PURE__ */ new Set();
			return n.set(e, r), r.add(t), () => {
				r.delete(t);
			};
		},
		setControl(e, t) {
			let n = u(), r = e.indexOf(".");
			if (r <= 0 || r === e.length - 1) throw RangeError(`Control path must be "node.param": ${e}`);
			let i = e.slice(0, r), a = e.slice(r + 1), o = !1;
			for (let e of n.layers) o = e.layer.setParam(i, a, t) || o;
			if (!o) throw RangeError(`No layer exposes control ${e}`);
		},
		update() {
			let e = u();
			if (a) {
				let n = c + J(s, t.now()), r = n - e.runtime.getTick(), i = e.runtime.frameBuffer.localTick;
				if (r >= 0 ? e.runtime.stepTick(r) : e.runtime.seek(n), p(e.runtime.frameBuffer.crossedMarkers), r > 0) for (let t of e.events) p(j(t.list, i, e.runtime.frameBuffer.localTick, e.compiled.sections));
			}
			return f(e), e.runtime.getTick();
		},
		get tick() {
			return r?.runtime.getTick() ?? 0;
		},
		get playing() {
			return a;
		},
		dispose() {
			i || (d(), n.clear(), i = !0, o++);
		}
	};
}
function xe(e) {
	return {
		ready: !0,
		value: be(e)
	};
}
function Se(e, t) {
	return e.t0 + t * he;
}
export { r as EXP_FORMAT, M as EXP_READ_LIMITS, G as V2_CLIP_ID, W as V2_TRACK_ID, K as compositionFromV2, be as createPlayer, n as describeUnavailable, Y as effectiveSeed, t as isReady, xe as preparePlayer, te as readExpPackage, J as sessionTick, Se as sessionTimeOfTick, q as systemClock, e as unavailable };
