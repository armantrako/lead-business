'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Moon,
  Sun,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Database,
  Filter,
  Calendar,
} from 'lucide-react';
import { BusinessCategory, CATEGORY_OPTIONS, ClientVisibleLead } from '@/types';
import { SUPPORTED_COUNTRIES } from '@/data/locations';

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const STORAGE_KEY = 'lead_business_seen_ig_ids_v2';

export default function LeadBusinessApp() {
  // Theme state (dark by default)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Filter states
  const [category, setCategory] = useState<BusinessCategory>('all');
  const [country, setCountry] = useState<string>('Bosna i Hercegovina');
  const [city, setCity] = useState<string>('all');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Search execution states
  const [loading, setLoading] = useState<boolean>(false);
  const [leads, setLeads] = useState<ClientVisibleLead[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [totalQualified, setTotalQualified] = useState<number>(0);
  const [totalActiveObjects, setTotalActiveObjects] = useState<number>(134);
  const [searchTimestamp, setSearchTimestamp] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Deduplication state (persisted in localStorage)
  const [seenIds, setSeenIds] = useState<string[]>([]);

  // Initialize from client storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSeenIds(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load seen IDs from localStorage:', e);
    }
  }, []);

  // Update available cities when country changes
  useEffect(() => {
    const selected = SUPPORTED_COUNTRIES.find((c) => c.name === country) || SUPPORTED_COUNTRIES[0];
    if (selected) {
      setAvailableCities(selected.cities);
    }
  }, [country]);

  // Toggle dark/light theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Perform search
  const handleSearch = async (resetHistory = false) => {
    setLoading(true);
    setError(null);
    setInfoMessage(null);
    setHasSearched(true);

    const activeExcluded = resetHistory ? [] : seenIds;

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          country,
          city,
          excludedIds: activeExcluded,
          limit: 10,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Došlo je do greške prilikom pretrage.');
        setLeads([]);
        setTotalQualified(0);
      } else {
        const returnedLeads: ClientVisibleLead[] = data.leads || [];
        setLeads(returnedLeads);
        setTotalQualified(data.totalQualified || returnedLeads.length);
        setTotalActiveObjects(data.totalActiveObjectsInSystem || 120);
        setSearchTimestamp(data.searchTimestamp || new Date().toLocaleString('bs-BA'));
        setInfoMessage(data.message || null);

        // Update seen IDs for deduplication
        const newSeen = Array.from(
          new Set([...activeExcluded, ...returnedLeads.map((l) => l.id)])
        );
        setSeenIds(newSeen);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newSeen));
        } catch (e) {
          console.warn('Failed to save to localStorage:', e);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Mrežna greška';
      setError(`Neuspjelo povezivanje sa servisom: ${msg}`);
      setLeads([]);
      setTotalQualified(0);
    } finally {
      setLoading(false);
    }
  };

  // Clear history of seen leads
  const handleClearHistory = () => {
    setSeenIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode
          ? 'dark bg-[#0c0e12] text-[#f1f3f7]'
          : 'bg-[#f8f9fa] text-[#1a1d21]'
      }`}
    >
      {/* GORNJA TRAKA (HEADER) */}
      <header className="border-b border-[#232731] dark:border-[#232731] light:border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white dark:text-white light:text-gray-900">
                  Lead Business
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800 font-medium">
                  Instagram & Facebook Ads
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Pronalazak 10 provjerenih klijenata za izradu reklamnih vizuala
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 self-end sm:self-center">
            {/* Oznaka broja aktivnih objekata (> 100 objekata) */}
            <div
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-medium"
              title="Broj stvarnih aktivnih poslovnih objekata u bazi sa >5.000 pratitelja u Bosni i Hercegovini"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{totalActiveObjects} aktivnih objekata (BiH)</span>
            </div>

            {/* Tema toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[#2d323e] hover:bg-[#1a1e27] text-gray-400 hover:text-white transition"
              title="Promijeni temu"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* GLAVNI SADRŽAJ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* BANER O PRAVILIMA I DEDUPLIKACIJI */}
        <div className="p-4 rounded-xl bg-[#13161c] border border-[#222733] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Strogi kriteriji verifikacije:</strong> Stvarni poslovni subjekt &bull; Preko 5.000 pratitelja &bull; Aktivan profil sa objavom u zadnjih 24h &bull; Bez izmišljenih profila
            </span>
          </div>
          {seenIds.length > 0 && (
            <div className="flex items-center space-x-3 self-start md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#222733]">
              <span className="text-gray-400">
                Zapamćeno u istoriji: <strong className="text-gray-200">{seenIds.length}</strong> profila
              </span>
              <button
                onClick={handleClearHistory}
                className="text-blue-400 hover:text-blue-300 hover:underline flex items-center space-x-1"
                title="Isprazni istoriju viđenih profila kako bi pretraga ponovo mogla prikazati ranije viđene profile"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Očisti istoriju</span>
              </button>
            </div>
          )}
        </div>

        {/* FORMA ZA PRETRAGU NA VRHU STRANICE */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#13161c] border border-[#222733] shadow-lg shadow-black/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* 1. Izbor poslovne kategorije */}
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-400" />
                <span>Poslovna kategorija</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#1c212b] border border-[#303747] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.icon} {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Izbor države */}
            <div className="sm:col-span-1 lg:col-span-3">
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Država
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#1c212b] border border-[#303747] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Izbor grada */}
            <div className="sm:col-span-1 lg:col-span-3">
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Grad ({availableCities.length})
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#1c212b] border border-[#303747] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <option value="all">Svi gradovi</option>
                {availableCities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. DUGME „TRAŽI“ */}
            <div className="sm:col-span-2 lg:col-span-2">
              <button
                type="button"
                onClick={() => handleSearch(false)}
                disabled={loading}
                className="w-full py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-blue-600/30 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Tražim...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Traži</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* META TRAKA PRETRAGE: BROJ PRONAĐENIH KVALIFIKOVANIH PROFILA I DATUM/VRIJEME */}
          {hasSearched && (
            <div className="mt-5 pt-4 border-t border-[#222733] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Broj pronađenih kvalifikovanih profila:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-800">
                  {totalQualified} {totalQualified === 1 ? 'profil' : totalQualified < 5 ? 'profila' : 'profila'}
                </span>
              </div>

              {searchTimestamp && (
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    Datum i vrijeme pretrage: <strong className="text-gray-200">{searchTimestamp}</strong>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* GREŠKA BANER */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Greška prilikom pretrage</p>
              <p className="text-xs text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* INFO BANER (AKO IMA MANJE OD 10 ILI NEMA VIŠE NOVIH) */}
        {infoMessage && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{infoMessage}</p>
          </div>
        )}

        {/* REZULTATI PRETRAGE: JEDNOSTAVNA TABELA / LISTA SA SAMO DVA PODATKA: NAZIV I DIREKTAN INSTAGRAM LINK */}
        {hasSearched && leads.length > 0 && (
          <div className="rounded-2xl bg-[#13161c] border border-[#222733] overflow-hidden shadow-lg shadow-black/20">
            <div className="p-4 sm:p-5 border-b border-[#222733] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Kvalifikovani potencijalni klijenti</span>
                  <span className="text-xs font-normal text-gray-400">
                    ({leads.length} novih rezultata)
                  </span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Poslovni profili sa više od 5.000 pratitelja i objavom u posljednja 24 sata
                </p>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Provjereno</span>
              </div>
            </div>

            {/* TABELA REZULTATA */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#222733] bg-[#171a22] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-5 sm:px-6 w-12 text-center">#</th>
                    <th className="py-3 px-5 sm:px-6">Naziv poslovnog profila</th>
                    <th className="py-3 px-5 sm:px-6">Direktan Instagram link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e222c]">
                  {leads.map((lead, idx) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#181c24] transition-colors group"
                    >
                      {/* Redni broj */}
                      <td className="py-3.5 px-5 sm:px-6 text-center text-xs font-mono text-gray-500">
                        {idx + 1}
                      </td>

                      {/* NAZIV POSLOVNOG PROFILA */}
                      <td className="py-3.5 px-5 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-[#202533] border border-[#2d3447] flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition-transform">
                            <InstagramIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                              {lead.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* DIREKTAN INSTAGRAM LINK */}
                      <td className="py-3.5 px-5 sm:px-6">
                        <a
                          href={lead.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 font-medium font-mono text-xs hover:underline bg-blue-950/40 hover:bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-800/60 transition"
                        >
                          <span>{lead.instagramUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DNO TABELE: SLJEDEĆA PRETRAGA */}
            <div className="p-4 border-t border-[#222733] bg-[#111318] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-2">
              <span>
                Sljedećim klikom na dugme <strong>„Traži“</strong> dobićete novih 10 profila bez ponavljanja.
              </span>
              <button
                onClick={() => handleSearch(false)}
                disabled={loading}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline flex items-center space-x-1"
              >
                <span>Pronađi još 10 klijenata</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* POČETNO STANJE KADA PRETRAGA JOŠ NIJE POKRENUTA */}
        {!hasSearched && (
          <div className="p-8 sm:p-12 rounded-2xl bg-[#13161c] border border-[#222733] text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1c212b] border border-[#2d3447] mx-auto flex items-center justify-center text-blue-400">
              <Search className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-white">
                Spremno za pretragu potencijalnih klijenata
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Odaberite željenu kategoriju (ili sve kategorije) i lokaciju, zatim kliknite na dugme <strong>„Traži“</strong> za prikaz 10 provjerenih Instagram poslovnih profila.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSearch(false)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/30"
              >
                Pokreni pretragu (Traži)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
