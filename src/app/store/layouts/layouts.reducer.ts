import { Action, createReducer, on } from '@ngrx/store';
import { changesLayout, changeMode, changeLayoutWidth, changeSidebarMode, changeTopbarMode } from './layout.actions';
import { DATA_LAYOUT_MODE, LAYOUT_MODE_TYPES, LAYOUT_WIDTH_TYPES, SIDEBAR_TYPE, TOPBAR_MODE_TYPES } from './layout';

export interface LayoutState {
    LAYOUT_MODE: string;
    DATA_LAYOUT: string;
    LAYOUT_WIDTH: string;
    SIDEBAR_MODE: string;
    TOPBAR_TYPE: string;
}

// localStorage keys used to remember the user's picks across reloads.
const STORAGE_KEYS = {
    mode: 'platx_layout_mode',
    sidebar: 'platx_sidebar_mode',
    topbar: 'platx_topbar_mode',
    layout: 'platx_data_layout',
    width: 'platx_layout_width',
} as const;

/**
 * Reads a saved theme value from localStorage, falling back to `fallback` when
 * the value is missing / storage is unavailable / the value is outside the
 * allowed set. Also normalizes so a stale localStorage entry can't wedge the
 * app into an unknown state.
 */
function readStored(key: string, allowed: string[], fallback: string): string {
    try {
        const value = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
        return value && allowed.includes(value) ? value : fallback;
    } catch {
        return fallback;
    }
}

function writeStored(key: string, value: string): void {
    try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    } catch {
        // localStorage disabled — ignore, in-memory state still works.
    }
}

// INIT_STATE — dark theme is the app default. Saved user picks (if any) win
// so a reload keeps whatever the user last chose in the right sidebar.
export const initialState: LayoutState = {
    LAYOUT_MODE: readStored(
        STORAGE_KEYS.mode,
        [LAYOUT_MODE_TYPES.LIGHTMODE, LAYOUT_MODE_TYPES.DARKMODE],
        LAYOUT_MODE_TYPES.DARKMODE,
    ),
    DATA_LAYOUT: readStored(
        STORAGE_KEYS.layout,
        [DATA_LAYOUT_MODE.VERTICAL, DATA_LAYOUT_MODE.HORIZONTAL],
        DATA_LAYOUT_MODE.VERTICAL,
    ),
    LAYOUT_WIDTH: readStored(
        STORAGE_KEYS.width,
        [LAYOUT_WIDTH_TYPES.FLUID, LAYOUT_WIDTH_TYPES.BOXED, LAYOUT_WIDTH_TYPES.SCROLLABLE],
        LAYOUT_WIDTH_TYPES.FLUID,
    ),
    SIDEBAR_MODE: readStored(
        STORAGE_KEYS.sidebar,
        [SIDEBAR_TYPE.LIGHT, SIDEBAR_TYPE.DARK, SIDEBAR_TYPE.COLOERED],
        SIDEBAR_TYPE.DARK,
    ),
    TOPBAR_TYPE: readStored(
        STORAGE_KEYS.topbar,
        [TOPBAR_MODE_TYPES.LIGHT, TOPBAR_MODE_TYPES.DARK, TOPBAR_MODE_TYPES.COLORED],
        TOPBAR_MODE_TYPES.DARK,
    ),
}

// Reducer — writes every user-selected pick back to localStorage so the next
// reload's initial state picks it up. Kept as a side effect inside the on()
// handler (Skote's own reducer already mixes attribute writes into ngOnInit
// so an extra localStorage write here is consistent with the codebase).
export const layoutReducer = createReducer(
    initialState,
    on(changeMode, (state, action) => {
        writeStored(STORAGE_KEYS.mode, action.mode);
        return { ...state, LAYOUT_MODE: action.mode };
    }),
    on(changesLayout, (state, action) => {
        writeStored(STORAGE_KEYS.layout, action.layoutMode);
        return { ...state, DATA_LAYOUT: action.layoutMode };
    }),
    on(changeLayoutWidth, (state, action) => {
        writeStored(STORAGE_KEYS.width, action.layoutWidth);
        return { ...state, LAYOUT_WIDTH: action.layoutWidth };
    }),
    on(changeSidebarMode, (state, action) => {
        writeStored(STORAGE_KEYS.sidebar, action.sidebarMode);
        return { ...state, SIDEBAR_MODE: action.sidebarMode };
    }),
    on(changeTopbarMode, (state, action) => {
        writeStored(STORAGE_KEYS.topbar, action.topbarmode);
        return { ...state, TOPBAR_TYPE: action.topbarmode };
    }),
);

// Selector
export function reducer(state: LayoutState | undefined, action: Action) {
    return layoutReducer(state, action);
}
