export function setPath(path) {
    window.history.replaceState(null, "", path);
}
