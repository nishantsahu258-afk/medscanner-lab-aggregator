import { useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8010/api";
const rupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function Header() {
  return (
    <header className="main-header">
      <div className="container header-container">
        <div className="brand">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
          </div>
          <div className="brand-text">
            <h1>MedScanner</h1>
            <p>Compare Lab Tests. Save on Health.</p>
          </div>
        </div>
        <div className="mobile-menu-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ testName, setTestName, pincode, setPincode, onSearch, loading }) {
  return (
    <section className="hero-section">
      <div className="hero-content container">
        <div className="hero-main">
          <div className="hero-badge">
             ✓ Trusted Lab Test Search
          </div>
          <h2 className="hero-title">
            Find Lab Tests & Packages<br/>
            at the <span className="highlight">Best Prices</span> Near You
          </h2>
          <p className="hero-subtitle">
            Search for lab tests, compare prices from top diagnostic labs, and choose the best option for your health.
          </p>
          
          <form className="hero-search-form" onSubmit={onSearch}>
            <div className="search-input-group">
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <div className="input-inner">
                  <label>Test Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lipid Profile" 
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="input-divider"></div>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div className="input-inner">
                  <label>Pincode</label>
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    maxLength={6}
                    placeholder="e.g. 110001" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="search-btn" disabled={loading}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="hero-features">
          <div className="feature-item">
            <div className="feature-icon nabl-icon">✓</div>
            <span>NABL Certified Labs</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon home-icon">🏠</div>
            <span>Home Collection Info</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon price-icon">🏷️</div>
            <span>Compare Best Prices</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultCard({ item, isCheapest }) {
  const { pricing, logistics } = item;
  const isPackage = item.item_type === "package";
  const homeFee = logistics?.home_collection ? logistics.home_collection_fee ?? 0 : 0;
  const total = pricing.offer_price + homeFee;

  return (
    <article className="result-card">
      {isCheapest && <div className="best-price-ribbon">⭐ Best Price</div>}
      
      <div className="card-provider-col">
        <div className="provider-logo-placeholder">
          {item.provider_name.charAt(0)}
        </div>
        <h3 className="provider-name">{item.provider_name}</h3>
      </div>
      
      <div className="card-details-col">
        <div className="badges-row">
          <span className={`badge type-badge ${isPackage ? "package" : "single"}`}>
            {isPackage ? "📦 Package" : "🧪 Single Test"}
          </span>
          {item.nabl_accredited && (
            <span className="badge nabl-badge">✓ NABL Certified</span>
          )}
        </div>
        
        <h2 className="item-name">{item.item_name}</h2>
        
        {isPackage && item.included_tests?.length > 0 && (
          <div className="package-includes">
            <span className="includes-text">Includes {item.included_tests.length} tests</span>
            <div className="includes-tags">
              {item.included_tests.map((t) => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
          </div>
        )}
        
        <div className="logistics-row">
          {logistics?.report_tat_hours != null && (
            <span className="logistics-item">
               ⏱ {logistics.report_tat_hours} hours
            </span>
          )}
          <span className="logistics-item">
            {logistics?.home_collection ? "🏠 Home Collection Available" : "🏥 No Home Collection"}
          </span>
        </div>
      </div>
      
      <div className="card-pricing-col">
        <div className="pricing-breakdown">
          <div className="price-row">
            <span className="price-label">MRP</span>
            <span className="price-val mrp-val">{rupee(pricing.mrp)}</span>
          </div>
          <div className="price-row">
            <span className="price-label">Offer Price</span>
            <span className="price-val">{rupee(pricing.offer_price)}</span>
          </div>
          <div className="price-row">
            <span className="price-label">Home Collection Fee</span>
            <span className="price-val">{rupee(homeFee)}</span>
          </div>
        </div>
        
        <div className={`final-price-box ${isPackage ? "package-theme" : "single-theme"}`}>
          <div className="final-price-label">
            Total Final Price ⓘ
          </div>
          <div className="final-price-amount">{rupee(total)}</div>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [testName, setTestName] = useState("");
  const [pincode, setPincode] = useState("");
  const [lastSearched, setLastSearched] = useState(null);
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        search_query: testName.trim(),
        pincode: pincode.trim(),
      });
      const res = await fetch(`${API_BASE}/search?${params}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setLastSearched({ query: testName.trim(), pin: pincode.trim() });
    } catch (err) {
      setResults(null);
      setError(`Could not fetch results. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <Header />
      
      <main>
        <HeroSection 
          testName={testName}
          setTestName={setTestName}
          pincode={pincode}
          setPincode={setPincode}
          onSearch={handleSearch}
          loading={loading}
        />
        
        <div className="container results-container">
          {error && <div className="error-state">{error}</div>}
          
          {loading && <div className="loading-state">Fetching best prices...</div>}

          {results && !loading && !error && (
            <div className="results-section">
              <div className="results-header">
                <div className="results-title-area">
                  <h2>Search Results for "{lastSearched?.query}"</h2>
                  <p>{results.length} results found in {lastSearched?.pin}, sorted by lowest total price</p>
                </div>
              </div>

              {results.length === 0 ? (
                <div className="empty-state">
                  No tests found for this name and pincode. Try a different search.
                </div>
              ) : (
                <div className="results-list">
                  {results.map((item, idx) => (
                    <ResultCard 
                      key={item.id} 
                      item={item} 
                      isCheapest={idx === 0} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
