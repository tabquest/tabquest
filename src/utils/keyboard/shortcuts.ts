type ShortcutHandler = () => void;

const registry = new Map<string, ShortcutHandler>();

export const registerShortcut = (
  key: string,
  handler: ShortcutHandler,
): void => {
  registry.set(key.toLowerCase(), handler);
};

export const unregisterShortcut = (key: string): void => {
  registry.delete(key.toLowerCase());
};

export const handleKeyEvent = (e: KeyboardEvent): boolean => {
  const target = e.target as HTMLElement;
  const isEditable =
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable;
  if (isEditable) return false;

  const handler = registry.get(e.key.toLowerCase());
  if (handler) {
    e.preventDefault();
    handler();
    return true;
  }
  return false;
};
