/// <reference types="vite/client" />

declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | Record<string, unknown>): Promise<Record<string, unknown>>
      set(items: Record<string, unknown>): Promise<void>
      remove(keys: string | string[]): Promise<void>
      clear(): Promise<void>
    }

    const local: StorageArea
    const session: StorageArea
    const sync: StorageArea
  }

  namespace runtime {
    const id: string
    function sendMessage(message: unknown, responseCallback?: (response: unknown) => void): void
    function getManifest(): { version: string }
  }
}
