import { computed, readonly, shallowRef } from 'vue';
const THEME_STORAGE_KEY = 'geekmelon-theme';
const currentTheme = shallowRef('light');
let initialized = false;
function getStoredTheme() {
    if (typeof window === 'undefined') {
        return null;
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
}
function getSystemTheme() {
    if (typeof window === 'undefined') {
        return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(theme) {
    if (typeof document === 'undefined') {
        return;
    }
    document.documentElement.dataset.theme = theme;
}
function setTheme(theme) {
    currentTheme.value = theme;
    applyTheme(theme);
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
}
function initializeTheme() {
    if (initialized) {
        return;
    }
    initialized = true;
    const nextTheme = getStoredTheme() ?? getSystemTheme();
    currentTheme.value = nextTheme;
    applyTheme(nextTheme);
}
export function useThemePreference() {
    initializeTheme();
    const isDark = computed(() => currentTheme.value === 'dark');
    function toggleTheme() {
        setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
    }
    return {
        currentTheme: readonly(currentTheme),
        isDark,
        setTheme,
        toggleTheme,
    };
}
