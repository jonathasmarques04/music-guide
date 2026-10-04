// Testes locais: código real transpilado, React/SDK/storage simulados, sem rede.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function harness() {
  let runtime;
  const memory = new Map();
  const calls = [];
  const timers = new Set();
  const h = {
    memory, calls, timers,
    session: { user: { id: 'account-a', email: 'a@example.invalid' }, access_token: 'synthetic-a' },
    select: async () => ({ data: [], error: null }),
    profile: async () => ({ data: { nome: 'Aluno', avatar_url: null }, error: null }),
    rpc: async () => ({ error: null }),
    remove: async () => ({ error: null }),
    update: async () => ({ error: null }),
    signup: async () => ({ data: { user: { identities: [] }, session: null }, error: null }),
    storageFails: false,
  };
  function newRuntime() {
    const cells = [], effects = [], pending = [];
    let cursor = 0;
    const r = {
      state(initial) {
        const i = cursor++;
        if (!(i in cells)) cells[i] = typeof initial === 'function' ? initial() : initial;
        return [cells[i], next => { cells[i] = typeof next === 'function' ? next(cells[i]) : next; }];
      },
      ref(value) { return r.state(() => ({ current: value }))[0]; },
      effect(fn, deps) {
        const i = cursor++;
        const old = effects[i];
        if (!old || deps.some((v, j) => !Object.is(v, old.deps[j]))) {
          pending.push(() => { old?.cleanup?.(); effects[i] = { deps, cleanup: fn() }; });
        }
      },
      render(fn) { cursor = 0; runtime = r; const value = fn(); while (pending.length) pending.shift()(); return value; },
      unmount() { effects.forEach(e => e?.cleanup?.()); },
    };
    return r;
  }
  const react = {
    createContext: () => ({ Provider: 'Provider' }), useContext: () => { throw Error('Unexpected useContext'); },
    useState: initial => runtime.state(initial), useRef: value => runtime.ref(value), useEffect: (fn, deps) => runtime.effect(fn, deps),
  };
  const jsx = (type, props, key) => ({ type, props, key });
  function query(table) {
    let operation, values, filters = {}, headers = {};
    const q = {
      select: () => { operation = 'select'; return q; },
      delete: () => { operation = 'delete'; return q; },
      update: data => { operation = 'update'; values = data; return q; },
      eq: (name, value) => { filters[name] = value; return q; },
      setHeader: (name, value) => { headers[name] = value; return q; },
      maybeSingle: () => q,
      then(resolve, reject) {
        calls.push({ table, operation, values, filters, headers });
        const task = operation === 'select' ? (table === 'perfis' ? h.profile : h.select) : h.update;
        return Promise.resolve().then(() => task({ table, operation, values, filters, headers })).then(resolve, reject);
      },
    };
    return q;
  }
  const supabase = {
    from: query,
    rpc: (name, args) => {
      const headers = {};
      const q = { setHeader: (key, value) => { headers[key] = value; return q; }, then: (resolve, reject) => {
        calls.push({ operation: 'rpc', name, args, headers });
        return Promise.resolve().then(() => h.rpc(args, headers)).then(resolve, reject);
      } };
      return q;
    },
    auth: {
      getSession: async () => ({ data: { session: h.session }, error: null }),
      onAuthStateChange: callback => { h.authChange = callback; return { data: { subscription: { unsubscribe() {} } } }; },
      signUp: (...args) => h.signup(...args),
    },
    storage: { from: () => ({
      remove: async () => { calls.push({ operation: 'remove' }); return h.remove(); },
      upload: async () => ({ error: null }),
      createSignedUrl: async (file, ttl) => {
        calls.push({ operation: 'sign', file, ttl });
        return { data: { signedUrl: 'https://example.invalid/signed-avatar' }, error: null };
      },
    }) },
  };
  const stubs = {
    react, 'react/jsx-runtime': { jsx, jsxs: jsx },
    '@react-native-async-storage/async-storage': {
      getItem: async key => { if (h.storageFails) throw Error('storage unavailable'); return memory.get(key) ?? null; },
      setItem: async (key, value) => { if (h.storageFails) throw Error('storage unavailable'); memory.set(key, value); },
    },
    'react-native': { AppState: { addEventListener: (_, fn) => { h.onActive = fn; return { remove() {} }; } }, Platform: { OS: 'web' }, StyleSheet: { create: x => x }, View: 'View' },
    '@/contexts/auth': { useAuth: () => ({ session: h.session ? { usuarioId: h.session.user.id } : null }) },
    '@/lib/supabase': { supabase },
    'expo-linking': { useURL: () => null, createURL: () => 'https://example.invalid/' },
    'expo-router': { useLocalSearchParams: () => ({ id: 'escalas' }), useRouter: () => ({}) },
    'react-native-reanimated': { useReducedMotion: () => false },
    '@/hooks/use-hover': { useHover: () => ({}) }, '@/hooks/use-theme': { useTheme: () => ({}) },
    '@/constants/theme': new Proxy({}, { get: () => new Proxy({}, { get: () => 1 }) }),
  };
  const cache = new Map();
  function load(relative) {
    const filename = path.resolve(root, relative);
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} }; cache.set(filename, module);
    const source = fs.readFileSync(filename, 'utf8');
    const js = ts.transpileModule(source, { fileName: filename, compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
    } }).outputText;
    const resolver = name => {
      if (name in stubs) return stubs[name];
      if (name.startsWith('@/components/')) return new Proxy({}, { get: (_, k) => k });
      if (name.startsWith('@/')) {
        const base = 'src/' + name.slice(2);
        return load(fs.existsSync(path.join(root, base + '.ts')) ? base + '.ts' : base + '.tsx');
      }
      if (name.startsWith('.')) return load(path.resolve(path.dirname(filename), name) + '.ts');
      return require(name);
    };
    vm.runInNewContext(js, { module, exports: module.exports, require: resolver, console, URLSearchParams,
      setInterval: fn => { timers.add(fn); return fn; }, clearInterval: fn => timers.delete(fn),
    }, { filename, timeout: 5000 });
    return module.exports;
  }
  h.load = load;
  h.stubs = stubs;
  h.mount = (file, exported, keyed = true) => {
    const Component = load(file)[exported];
    let instance, previousKey;
    return {
      render() {
        let child;
        if (keyed) child = Component({ children: 'children' });
        else child = { type: Component, props: { children: 'children' }, key: 'direct' };
        if (!instance || child.key !== previousKey) { instance?.unmount(); instance = newRuntime(); previousKey = child.key; }
        const element = instance.render(() => child.type(child.props));
        return element.props.value ?? element;
      },
      unmount() { instance?.unmount(); instance = null; },
      async settle() { for (let i = 0; i < 12; i++) { this.render(); await new Promise(resolve => setImmediate(resolve)); } return this.render(); },
    };
  };
  return h;
}
module.exports = { harness };
