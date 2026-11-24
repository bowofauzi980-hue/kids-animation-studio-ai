/* KIDS ANIMATION STUDIO AI
   API KEY MANAGER - PHASE 1
   Browser-only encrypted storage
*/

const KeyManager = (() => {
  const DB_NAME = "KidsAnimationSecureVault";
  const STORE_NAME = "provider_keys";
  const SESSION_KEY = "kids_animation_session";

  let db = null;

  function bukaDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = event => {
        const database = event.target.result;

        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, {
            keyPath: "provider"
          });
        }
      };

      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async function dapatkanKunci() {
    let encoded = localStorage.getItem(SESSION_KEY);

    if (!encoded) {
      const raw = crypto.getRandomValues(new Uint8Array(32));

      encoded = Array.from(raw)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

      localStorage.setItem(SESSION_KEY, encoded);
    }

    const bytes = new Uint8Array(
      encoded.match(/.{2}/g).map(value => parseInt(value, 16))
    );

    return crypto.subtle.importKey(
      "raw",
      bytes,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function enkripsi(teks) {
    const key = await dapatkanKunci();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const hasil = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(teks)
    );

    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(hasil))
    };
  }

  async function dekripsi(record) {
    const key = await dapatkanKunci();

    const hasil = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(record.iv)
      },
      key,
      new Uint8Array(record.data)
    );

    return new TextDecoder().decode(hasil);
  }

  async function simpan(provider, apiKey) {
    if (!provider || !apiKey || apiKey.trim().length < 10) {
      throw new Error("Provider atau API Key tidak valid.");
    }

    await bukaDatabase();

    const encrypted = await enkripsi(apiKey.trim());

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");

      transaction.objectStore(STORE_NAME).put({
        provider,
        encrypted,
        updatedAt: Date.now()
      });

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function daftar() {
    await bukaDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).getAll();

      request.onsuccess = () => {
        resolve(request.result.map(item => ({
          provider: item.provider,
          updatedAt: item.updatedAt
        })));
      };

      request.onerror = () => reject(request.error);
    });
  }

  async function ambil(provider) {
    await bukaDatabase();

    return new Promise((resolve, reject) => {
      const request = db
        .transaction(STORE_NAME, "readonly")
        .objectStore(STORE_NAME)
        .get(provider);

      request.onsuccess = async () => {
        try {
          resolve(request.result
            ? await dekripsi(request.result.encrypted)
            : null);
        } catch (error) {
          reject(error);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async function hapus(provider) {
    await bukaDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(provider);

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  return {
    simpan,
    daftar,
    ambil,
    hapus
  };
})();
