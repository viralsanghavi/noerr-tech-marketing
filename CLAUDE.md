# Project rules for AI-assisted changes

Read before every task. If anything here conflicts with what I ask in chat, ask — don't silently pick one.

## Stack
React + Vite + TypeScript. <fill in: UI lib, forms, router, query layer, test runner>

## Before writing any code
1. Search the codebase for existing implementations of this and anything adjacent. Report file paths.
2. Say whether to reuse, extend, or write new — and why.
3. If new: where it lives, and which existing file it should mirror.
4. If modifying an existing component, map it first — responsibilities with line ranges, who owns each piece of state, what each effect actually does, what's untestable without mounting the whole tree.
5. Give me the plan. No code until I approve it.

## Component design
- Split by reason to change, never by line count. Two pieces that always change together stay one piece.
- Extract stateful logic into hooks first, then re-check. Most components stop needing a JSX split once the hooks are out.
- An extracted component needing more than ~5 props means the seam was wrong. Reconsider it, or use children/slots instead of config props.
- No prop drilling past one level to make a split work. If you need to, the state is in the wrong place — say so instead of drilling.
- Single-use, non-independently-testable sub-components stay in the same file, below the main export. Separate files are for reuse, lazy loading, or independent tests.
- Presentation components take data and callbacks. They don't fetch and don't know the server exists.
- One hook per concern, not one per component. A hook returning 11 unrelated values is the god component in disguise.
- Name hooks as capabilities (`useInvoiceFilters`), not locations (`useInvoicePageState`). Return intent-named actions, not raw setters.
- A "hook" with no state, effect, ref, or context is a plain function — move it out of hooks/.

## State and effects
- Derive during render. Never useState + useEffect to compute a value from other values.
- Effects synchronise with things outside React. Everything else is an event handler or a computation.
- State lives at the lowest common owner. Never mirror props into state; never duplicate state across parent and child.
- Server data belongs in the query layer, not useState.
- Always clean up subscriptions, timers, listeners, aborts. No stale closures in async callbacks.
- Lists keyed by stable IDs, never index.

## Types
- No new `any`, `as` casts, `@ts-ignore`, or eslint-disable. If you think you need one, stop and explain.
- Variants are discriminated unions, not combinations of boolean flags.
- Callbacks named for intent (`onFiltersApplied`), not implementation (`onFilterStateChange`).

## Performance
- Diagnose before optimising: name what re-renders and why — parent render, context identity, unstable props, or state churn.
- Fix the cause: move state down, split the