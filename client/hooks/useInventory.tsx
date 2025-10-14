import { useCallback, useEffect, useState } from "react";

export type InventoryEntry = {
  id: string;
  alias: string;
  host: string;
  port: number;
  type: "tigervnc" | "realvnc";
  tls: boolean;
  auth: "password" | "cert" | "ldap" | "none";
  features: { clipboard: boolean; fileTransfer: boolean };
  tags: string[];
  env: "test" | "staging" | "prod";
  lastValidated?: string | null;
};

const STORAGE_KEY = "vnc:inventory";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function useInventory() {
  const [entries, setEntries] = useState<InventoryEntry[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch (e) {
        setEntries([]);
      }
    } else {
      // seed with a sample entry
      const seed: InventoryEntry[] = [
        {
          id: uid(),
          alias: "vm-clipboard-01",
          host: "10.0.0.21",
          port: 5900,
          type: "tigervnc",
          tls: true,
          auth: "password",
          features: { clipboard: true, fileTransfer: true },
          tags: ["test"],
          env: "test",
          lastValidated: null,
        },
      ];
      setEntries(seed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    }
  }, []);

  const persist = useCallback((next: InventoryEntry[]) => {
    setEntries(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const add = useCallback(
    (entry: Partial<InventoryEntry>) => {
      const e: InventoryEntry = {
        id: uid(),
        alias: entry.alias || `vnc-${uid()}`,
        host: entry.host || "",
        port: entry.port || 5900,
        type: (entry.type as any) || "tigervnc",
        tls: entry.tls ?? false,
        auth: (entry.auth as any) || "password",
        features: entry.features || { clipboard: true, fileTransfer: true },
        tags: entry.tags || [],
        env: (entry.env as any) || "test",
        lastValidated: null,
      };
      persist([e, ...entries]);
      return e;
    },
    [entries, persist],
  );

  const update = useCallback(
    (id: string, patch: Partial<InventoryEntry>) => {
      const next = entries.map((e) => (e.id === id ? { ...e, ...patch } : e));
      persist(next);
    },
    [entries, persist],
  );

  const remove = useCallback(
    (id: string) => {
      const next = entries.filter((e) => e.id !== id);
      persist(next);
    },
    [entries, persist],
  );

  const testConnection = useCallback(
    async (id: string) => {
      // simulate network check with delay
      const entry = entries.find((e) => e.id === id);
      if (!entry) return { ok: false, log: "not found" };
      await new Promise((res) => setTimeout(res, 700 + Math.random() * 800));
      const ok = Math.random() > 0.1; // 90% chance succeed
      const log = ok
        ? "TLS handshake ok; auth ok"
        : "Connection failed: timeout";
      update(id, { lastValidated: new Date().toISOString() });
      return { ok, log };
    },
    [entries, update],
  );

  return { entries, add, update, remove, testConnection };
}
