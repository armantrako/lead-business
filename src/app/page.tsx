'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  UtensilsCrossed,
  Search,
  MapPin,
  Phone,
  Star,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Key,
  Moon,
  Sun,
  RefreshCw,
} from 'lucide-react';
import { BusinessType, Country, Destination, SearchAudit, VerifiedLead } from '@/types';

export default function LeadBusinessApp() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('');
  const [businessType, setBusinessType] = useState<BusinessType>('hotels');
  
  // Results and status
  const [loading, setLoading] = useState<boolean>(false);
  const [searchStatusText, setSearchStatusText] = useState<string>('');
  const [leads, setLeads] = useState<VerifiedLead[]>([]);
  const [audit, setAudit] = useState<SearchAudit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isCachedResult, setIsCachedResult] = useState<boolean>(false);

  // API Key config status
  const [serverHasApiKey, setServerHasApiKey] = useState<boolean>(true);
  const [apiKeyOverride, setApiKeyOverride] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Copied phone state
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Theme state (dark by default)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // 1. Initial Load: Check API key presence and fetch countries
  useEffect(() => {
    async function init() {
      try {
        const [configRes, destRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/destinations'),
        ]);

        if (configRes.ok) {
          const configData = await configRes.json();
          setServerHasApiKey(configData.hasApiKey);
          if (!configData.hasApiKey) {
            setShowKeyInput(true);
          }
        }

        if (destRes.ok) {
          const destData = await destRes.json();
          setCountries(destData.countries || []);
          if (destData.countries && destData.countries.length > 0) {
            setSelectedCountry(destData.countries[0].name);
          }
        }
      } catch (e) {
        console.error('Failed to initialize:', e);
      }
    }
    init();
  }, []);

  // 2. Fetch destinations when selected country changes
  useEffect(() => {
    if (!selectedCountry) {
      setDestinations([]);
      setSelectedDestinationId('');
      return;
    }

    async function loadCountryDestinations() {
      try {
        const res = await fetch(`/api/destinations?country=${encodeURIComponent(selectedCountry)}`);
        if (res.ok) {
          const data = await res.json();
          const list: Destination[] = data.destinations || [];
          setDestinations(list);
          if (list.length > 0) {
            setSelectedDestinationId(list[0].id);
          } else {
            setSelectedDestinationId('');
          }
        }
      } catch (e) {
        console.error('Failed to load destinations:', e);
      }
    }

    loadCountryDestinations();
  }, [selectedCountry]);

  // Toggle theme
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
  const handleSearch = async (forceRefresh = false) => {
    if (!selectedDestinationId) {
      setError('Please select a destination first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchStatusText('Querying Google Places API...');
    setHasSearched(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: selectedDestinationId,
          businessType,
          apiKeyOverride: apiKeyOverride.trim() || undefined,
          forceRefresh,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Search failed. Please verify your parameters or API key.');
        setLeads([]);
        setAudit(null);
        if (data.errorCode === 'MISSING_API_KEY') {
          setShowKeyInput(true);
        }
      } else {
        setLeads(data.leads || []);
        setAudit(data.audit || null);
        setIsCachedResult(Boolean(data.isCached));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      setError(`Failed to connect to search service: ${message}`);
      setLeads([]);
      setAudit(null);
    } finally {
      setLoading(false);
      setSearchStatusText('');
    }
  };

  const copyPhoneNumber = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const selectedDestObj = destinations.find((d) => d.id === selectedDestinationId);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0c0e12] text-[#f1f3f7]' : 'bg-[#f8f9fa] text-[#1a1d21]'}`}>
      {/* Top Bar */}
      <header className="border-b border-[#232731] dark:border-[#232731] light:border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold tracking-tight text-white dark:text-white light:text-gray-900">
              Lead Business
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
              Autumn/Winter Lead Finder
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`text-xs px-2.5 py-1.5 rounded flex items-center space-x-1.5 transition border ${
                serverHasApiKey || apiKeyOverride
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                  : 'bg-amber-950/60 text-amber-300 border-amber-800/80 hover:bg-amber-900/60'
              }`}
              title="Configure Google Places API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{serverHasApiKey || apiKeyOverride ? 'API Configured' : 'Missing API Key'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded border border-[#2d323e] hover:bg-[#1a1e27] text-gray-400 hover:text-white transition"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* API Key Banner if missing */}
        {(!serverHasApiKey && !apiKeyOverride) || showKeyInput ? (
          <div className="mb-6 p-4 rounded-lg bg-[#161a23] border border-[#2d3343] text-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-2">
                <Key className="w-4 h-4" />
                <span>Google Places API Configuration</span>
              </div>
              <button
                onClick={() => setShowKeyInput(false)}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Hide
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Add your Google Places API Key to <code className="bg-[#202533] px-1 py-0.5 rounded text-gray-200">.env.local</code> as <code className="bg-[#202533] px-1 py-0.5 rounded text-emerald-300">GOOGLE_PLACES_API_KEY</code>, or paste it below for this session:
            </p>
            <div className="flex items-center space-x-2 max-w-xl">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyOverride}
                onChange={(e) => setApiKeyOverride(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded bg-[#0d0f14] border border-[#333b4e] text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => setShowKeyInput(false)}
                className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition"
              >
                Save
              </button>
            </div>
          </div>
        ) : null}

        {/* Filter / Search Form */}
        <div className="p-5 rounded-lg bg-[#13161c] border border-[#222733] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* 1. Country Selector */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                1. Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded bg-[#1c212b] border border-[#303747] text-white focus:outline-none focus:border-blue-500 transition"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.destinationsCount ?? '20+'} destinations)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Destination Selector */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                2. Destination ({destinations.length} available)
              </label>
              <select
                value={selectedDestinationId}
                onChange={(e) => setSelectedDestinationId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded bg-[#1c212b] border border-[#303747] text-white focus:outline-none focus:border-blue-500 transition"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.type}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Business Type Selector */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                3. Business Type
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#1c212b] rounded border border-[#303747]">
                <button
                  type="button"
                  onClick={() => setBusinessType('hotels')}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded transition ${
                    businessType === 'hotels'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hotels</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBusinessType('restaurants')}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded transition ${
                    businessType === 'restaurants'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Restaurants</span>
                </button>
              </div>
            </div>

            {/* 4. Search Button */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => handleSearch(false)}
                disabled={loading || !selectedDestinationId}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded font-medium text-sm transition flex items-center justify-center space-x-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Selected Destination Details Pill */}
          {selectedDestObj && (
            <div className="mt-3 pt-3 border-t border-[#1e232d] flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-gray-300 font-medium">{selectedDestObj.name}</span>
                <span>•</span>
                <span>{selectedDestObj.region}</span>
                <span>•</span>
                <span className="text-gray-500">{selectedDestObj.description}</span>
              </div>
              <div className="text-gray-500 font-mono">
                {selectedDestObj.lat.toFixed(4)}, {selectedDestObj.lng.toFixed(4)} (r: {(selectedDestObj.radiusMeters / 1000).toFixed(0)}km)
              </div>
            </div>
          )}
        </div>

        {/* Loading Progress State */}
        {loading && (
          <div className="p-8 rounded-lg bg-[#13161c] border border-[#222733] text-center my-6">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
            <div className="text-sm font-medium text-gray-200">
              {searchStatusText || 'Searching Google Places & Verifying Official Websites...'}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Checking phone validity, location boundaries, and secondary web search sources.
            </div>
          </div>
        )}

        {/* Error Box */}
        {error && !loading && (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/80 text-red-200 text-sm mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-red-300">Search Error</div>
              <div className="text-xs text-red-200/90 mt-1">{error}</div>
            </div>
          </div>
        )}

        {/* Audit Stats Banner */}
        {audit && !loading && (
          <div className="mb-6 p-3 rounded-lg bg-[#101319] border border-[#1e232e] flex flex-wrap items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="text-gray-200 font-medium">
                {leads.length} Verified {businessType === 'hotels' ? 'Hotels' : 'Restaurants'} Found
              </span>
              <span>•</span>
              <span>Scanned: {audit.totalScanned}</span>
              <span>•</span>
              <span className="text-amber-400/90">Excluded with website: {audit.excludedWithExistingWebsite}</span>
              <span>•</span>
              <span>No phone: {audit.excludedNoPhone}</span>
              <span>•</span>
              <span>Outside area: {audit.excludedDistant}</span>
            </div>

            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              {isCachedResult && (
                <span className="px-2 py-0.5 rounded bg-[#1c2230] text-blue-300 font-mono text-[11px]">
                  Cached
                </span>
              )}
              <button
                onClick={() => handleSearch(true)}
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition px-2 py-0.5 rounded hover:bg-[#1a1e27]"
                title="Force fresh search without cache"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        )}

        {/* Results List */}
        {!loading && hasSearched && leads.length === 0 && !error && (
          <div className="p-12 rounded-lg bg-[#13161c] border border-[#222733] text-center my-6">
            <div className="text-base font-semibold text-gray-300">
              No verified leads found.
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              All scanned businesses in this destination either possess an official website, lack a verified phone number, or failed secondary verification.
            </p>
          </div>
        )}

        {/* Leads Cards Grid */}
        {!loading && leads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <div
                key={lead.placeId}
                className="p-5 rounded-lg bg-[#141820] border border-[#232938] hover:border-[#353e54] transition flex flex-col justify-between"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                      {lead.name}
                    </h3>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center space-x-1.5 text-xs text-gray-400 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <span>
                      {lead.destination}, {lead.country}
                    </span>
                  </div>

                  {/* Rating & Reviews */}
                  <div className="flex items-center space-x-2 text-xs mb-3">
                    <div className="flex items-center space-x-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{lead.rating > 0 ? lead.rating.toFixed(1) : 'Unrated'}</span>
                    </div>
                    <span className="text-gray-500">
                      ({lead.userRatingsTotal} {lead.userRatingsTotal === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="p-2 rounded bg-[#0e1117] border border-[#1f2533] flex items-center justify-between text-xs text-gray-200 mb-3 font-mono">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{lead.phoneNumber}</span>
                    </div>
                    <button
                      onClick={() => copyPhoneNumber(lead.phoneNumber)}
                      className="p-1 hover:text-white text-gray-400 transition ml-2"
                      title="Copy phone number"
                    >
                      {copiedPhone === lead.phoneNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Verification Badge */}
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mb-4 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VERIFIED NO OFFICIAL WEBSITE</span>
                  </div>
                </div>

                {/* Footer Link: Google Maps */}
                <div className="pt-3 border-t border-[#1f2533] flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 truncate max-w-[170px]" title={lead.address}>
                    {lead.address}
                  </span>
                  <a
                    href={lead.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Initial Empty State before search */}
        {!hasSearched && !loading && (
          <div className="py-16 text-center border border-dashed border-[#262c3a] rounded-lg">
            <Building2 className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-400">
              Ready to find verified leads
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Select a country and one of its autumn/winter tourist destinations, choose hotels or restaurants, and click Search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
