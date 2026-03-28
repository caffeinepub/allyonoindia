import { Toaster } from "@/components/ui/sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Menu,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { App as AppType } from "./backend.d";
import { useActor } from "./hooks/useActor";

const ADMIN_PASSWORD = "7048919766@naviaxis";
const ADMIN_AUTH_KEY = "adminAuth";

const categories = [
  { id: "games", color: "#1e3a5f", icon: "🎮", label: "Games" },
  { id: "cards", color: "#3b5ea6", icon: "🃏", label: "Cards" },
  { id: "slots", color: "#6b2d8b", icon: "🎰", label: "Slots" },
  { id: "cricket", color: "#7a1a2e", icon: "🏏", label: "Cricket" },
  { id: "target", color: "#8b1a1a", icon: "🎯", label: "Target" },
  { id: "dice", color: "#1a5f6b", icon: "🎲", label: "Dice" },
];

function uint8ToObjectUrl(data: Uint8Array): string {
  const blob = new Blob([data.buffer as ArrayBuffer]);
  return URL.createObjectURL(blob);
}

function StarRating({ stars }: { stars: number }) {
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5;
  return (
    <div className="flex items-center justify-center gap-px mt-0.5">
      {[1, 2, 3, 4, 5].map((pos) => {
        const idx = pos - 1;
        let char = "☆";
        if (idx < full) char = "★";
        else if (idx === full && half) char = "⯨";
        return (
          <span
            key={pos}
            className="text-yellow-400"
            style={{ fontSize: "9px" }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

function AppCard({ app, index }: { app: AppType; index: number }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (app.logo && app.logo.length > 0) {
      const url = uint8ToObjectUrl(app.logo);
      setImgUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [app.logo]);

  const handleClick = () => {
    if (app.downloadLink) {
      window.open(app.downloadLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      type="button"
      className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer active:scale-95 transition-transform text-left w-full"
      style={{ borderBottom: "2px solid #7c3aed" }}
      data-ocid={`app.item.${index + 1}`}
      onClick={handleClick}
      aria-label={`Download ${app.name}`}
    >
      <div className="relative w-full">
        <div className="w-full aspect-square bg-gray-800 flex items-center justify-center rounded-t-lg overflow-hidden">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={app.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-xl">
              {app.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        {app.hot && (
          <div className="overflow-hidden absolute top-0 right-0 w-8 h-8">
            <div className="hot-badge">HOT</div>
          </div>
        )}
      </div>
      <div className="px-1 py-1 flex flex-col items-center">
        <p className="text-xs font-bold text-gray-800 truncate w-full text-center leading-tight">
          {app.name}
        </p>
        <p className="text-xs text-gray-400 text-center">{app.version}</p>
        <StarRating stars={app.stars} />
      </div>
    </button>
  );
}

function HomePage() {
  const { actor, isFetching } = useActor();
  const [apps, setApps] = useState<AppType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadApps = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getApps();
      setApps(result);
    } catch {
      toast.error("Failed to load apps");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && !isFetching) loadApps();
  }, [actor, isFetching, loadApps]);

  const filtered = apps.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] flex flex-col min-h-screen">
        <header style={{ background: "#0d0d0d" }}>
          <div className="flex items-center justify-between px-4 pt-4 pb-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "22px" }}>🎮</span>
              <span
                className="gradient-logo font-extrabold"
                style={{ fontSize: "22px", letterSpacing: "-0.5px" }}
              >
                VipYonoGames.Com
              </span>
            </div>
            <button
              type="button"
              className="text-white p-1"
              data-ocid="nav.button"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
          <p
            className="text-white text-center pb-3"
            style={{ fontSize: "13px" }}
          >
            Games App Download Link Here
          </p>
          <div style={{ height: "2px", background: "#7c3aed" }} />
          <div className="px-3 py-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="App search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md text-sm bg-gray-200 text-gray-800 placeholder-gray-500 outline-none"
                data-ocid="search.input"
              />
              <button
                type="button"
                className="px-3 py-2 rounded-md flex items-center justify-center"
                style={{ background: "#7c3aed" }}
                data-ocid="search.button"
                aria-label="Search"
              >
                <Search size={18} className="text-white" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-around px-4 pb-3">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                type="button"
                className="flex items-center justify-center rounded-full text-lg transition-transform active:scale-95"
                style={{
                  width: 48,
                  height: 48,
                  background: cat.color,
                  flexShrink: 0,
                }}
                data-ocid={`category.button.${i + 1}`}
                aria-label={cat.label}
              >
                {cat.icon}
              </button>
            ))}
          </div>
          <div style={{ height: "2px", background: "#7c3aed" }} />
        </header>

        <main className="flex-1 bg-gray-100 pb-6">
          <h2
            className="text-gray-800 font-bold px-3 pt-3 pb-2"
            style={{ fontSize: "18px" }}
          >
            Latest Apps
          </h2>

          {loading || isFetching ? (
            <div
              className="grid grid-cols-3 gap-2 px-2"
              data-ocid="app.loading_state"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden">
                  <div className="w-full aspect-square bg-gray-200 animate-pulse" />
                  <div className="px-1 py-2 space-y-1">
                    <div className="h-2 bg-gray-200 rounded animate-pulse mx-2" />
                    <div className="h-2 bg-gray-100 rounded animate-pulse mx-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center text-gray-400 py-10"
              data-ocid="app.empty_state"
            >
              No apps found
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 px-2" data-ocid="app.list">
              {filtered.map((app, i) => (
                <AppCard key={String(app.id)} app={app} index={i} />
              ))}
            </div>
          )}
        </main>

        <footer className="text-center py-3 bg-gray-100">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline hover:text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
            {" · "}
            <button
              type="button"
              className="underline hover:text-purple-600"
              onClick={() => {
                window.location.hash = "#admin";
              }}
              data-ocid="nav.link"
            >
              Admin
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_AUTH_KEY, "1");
      onLogin();
    } else {
      setError("Galat password. Dobara try karein.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm"
        data-ocid="admin.panel"
      >
        <div className="text-center mb-6">
          <span style={{ fontSize: "40px" }}>🔐</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Admin Panel</h1>
          <p className="text-sm text-gray-500">VipYonoGames.Com</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              id="admin-password"
              type={showPwd ? "text" : "password"}
              placeholder="Password dalein"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              data-ocid="admin.input"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPwd((v) => !v)}
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs" data-ocid="admin.error_state">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: "#7c3aed" }}
            data-ocid="admin.submit_button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { actor, isFetching } = useActor();
  const [apps, setApps] = useState<AppType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<bigint | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [appName, setAppName] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [stars, setStars] = useState(4);
  const [hot, setHot] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadApps = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getApps();
      setApps(result);
    } catch {
      toast.error("Apps load nahi hue");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && !isFetching) loadApps();
  }, [actor, isFetching, loadApps]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  const handleAddApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !appName || !downloadLink) {
      toast.error("App ka naam aur download link zaroori hai");
      return;
    }
    setSubmitting(true);
    try {
      let logoBytes: Uint8Array = new Uint8Array();
      if (logoFile) {
        const buf = await logoFile.arrayBuffer();
        logoBytes = new Uint8Array(buf);
      }
      await actor.addApp(appName, logoBytes, downloadLink, hot, stars, version);
      toast.success(`"${appName}" add ho gaya!`);
      setAppName("");
      setDownloadLink("");
      setVersion("1.0.0");
      setStars(4);
      setHot(false);
      setLogoFile(null);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadApps();
    } catch {
      toast.error("App add nahi hua. Dobara try karein.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: bigint, name: string) => {
    if (!actor) return;
    setDeleting(id);
    try {
      await actor.removeApp(id);
      toast.success(`"${name}" delete ho gaya`);
      await loadApps();
    } catch {
      toast.error("Delete nahi hua");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header style={{ background: "#0d0d0d" }} className="sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "20px" }}>🎮</span>
            <span
              className="gradient-logo font-extrabold"
              style={{ fontSize: "18px" }}
            >
              Admin Panel
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors"
            data-ocid="admin.secondary_button"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-purple-600" />
            Naya App Add Karein
          </h2>
          <form
            onSubmit={handleAddApp}
            className="space-y-4"
            data-ocid="admin.panel"
          >
            <div>
              <label
                htmlFor="logo-upload"
                className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-purple-400 transition-colors"
                data-ocid="admin.dropzone"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-1">
                    <span style={{ fontSize: "28px" }}>📱</span>
                    <span className="text-xs text-gray-400">Logo upload</span>
                  </div>
                )}
                <span className="text-xs text-purple-600 font-medium">
                  Click karke logo choose karein
                </span>
              </label>
              <input
                id="logo-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
                data-ocid="admin.upload_button"
              />
            </div>

            <div>
              <label
                htmlFor="app-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                App Ka Naam *
              </label>
              <input
                id="app-name"
                type="text"
                placeholder="e.g. OK RUMMY"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                data-ocid="admin.input"
              />
            </div>

            <div>
              <label
                htmlFor="download-link"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Download Link *
              </label>
              <input
                id="download-link"
                type="url"
                placeholder="https://..."
                value={downloadLink}
                onChange={(e) => setDownloadLink(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                data-ocid="admin.input"
              />
            </div>

            <div>
              <label
                htmlFor="app-version"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Version
              </label>
              <input
                id="app-version"
                type="text"
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                data-ocid="admin.input"
              />
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-1">
                Stars (1–5)
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStars(s)}
                    className="transition-transform hover:scale-110"
                    aria-label={`${s} star${s > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={24}
                      className={
                        s <= stars
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
                <span className="text-sm text-gray-500 ml-1">{stars}/5</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hot-toggle"
                checked={hot}
                onChange={(e) => setHot(e.target.checked)}
                className="w-4 h-4 accent-purple-600"
                data-ocid="admin.checkbox"
              />
              <label
                htmlFor="hot-toggle"
                className="text-sm font-medium text-gray-700"
              >
                HOT Badge lagaen 🔥
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "#7c3aed" }}
              data-ocid="admin.submit_button"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> App add ho raha
                  hai...
                </>
              ) : (
                <>
                  <Plus size={16} /> App Add Karein
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Apps ki List ({apps.length})
          </h2>
          {loading ? (
            <div
              className="text-center py-6 text-gray-400"
              data-ocid="admin.loading_state"
            >
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              Loading...
            </div>
          ) : apps.length === 0 ? (
            <div
              className="text-center py-6 text-gray-400"
              data-ocid="admin.empty_state"
            >
              Koi app nahi hai. Upar se add karein.
            </div>
          ) : (
            <div className="space-y-3" data-ocid="admin.list">
              {apps.map((app, idx) => (
                <AdminAppRow
                  key={String(app.id)}
                  app={app}
                  index={idx}
                  deleting={deleting === app.id}
                  onDelete={() => handleDelete(app.id, app.name)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              window.location.hash = "";
            }}
            className="text-xs text-gray-400 underline hover:text-purple-600"
            data-ocid="nav.link"
          >
            ← Home pe wapas jaein
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminAppRow({
  app,
  index,
  deleting,
  onDelete,
}: {
  app: AppType;
  index: number;
  deleting: boolean;
  onDelete: () => void;
}) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (app.logo && app.logo.length > 0) {
      const url = uint8ToObjectUrl(app.logo);
      setImgUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [app.logo]);

  return (
    <div
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
      data-ocid={`admin.item.${index + 1}`}
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={app.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-bold text-gray-500">
            {app.name.slice(0, 2)}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{app.name}</p>
        <p className="text-xs text-gray-500 truncate">{app.downloadLink}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">v{app.version}</span>
          {app.hot && (
            <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">
              HOT
            </span>
          )}
          <span className="text-xs text-yellow-500">★ {app.stars}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 flex-shrink-0"
        data-ocid={`admin.delete_button.${index + 1}`}
        aria-label={`Delete ${app.name}`}
      >
        {deleting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
      </button>
    </div>
  );
}

function AdminPanel() {
  const [authed, setAuthed] = useState(
    () => localStorage.getItem(ADMIN_AUTH_KEY) === "1",
  );

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const isAdmin = hash === "#admin";

  return (
    <>
      <Toaster />
      {isAdmin ? <AdminPanel /> : <HomePage />}
    </>
  );
}
