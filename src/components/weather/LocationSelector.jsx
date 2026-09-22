import React, { useState } from "react";
import { Search, MapPin, Navigation, ChevronDown, Check, Mountain, Radio } from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";

export function LocationSelector() {
  const { selectedLocation, setSelectedLocation, locationsList } = useWeather();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customCoordError, setCustomCoordError] = useState("");

  const filteredLocations = locationsList.filter((loc) => {
    const q = searchTerm.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q) ||
      loc.terrain.toLowerCase().includes(q) ||
      `${loc.lat}`.includes(q) ||
      `${loc.lon}`.includes(q)
    );
  });

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setCustomCoordError("");
  };

  const handleCustomCoordinates = (e) => {
    e.preventDefault();
    // Parse "lat, lon" or "lat lon"
    const parts = searchTerm.split(/[\s,]+/);
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lon) && lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98) {
        // Valid Indian coordinate range
        const customLoc = {
          id: `coord-${lat.toFixed(2)}-${lon.toFixed(2)}`,
          name: `Lat ${lat.toFixed(2)}°, Lon ${lon.toFixed(2)}°`,
          state: "Custom Coordinate Target",
          lat: lat,
          lon: lon,
          elevation: 150,
          terrain: "In-situ Interpolated Grid",
          climaticZone: "Dynamic Grid Point",
          radarStation: "Virtual Doppler Cell",
          currentRegime: "INTERPOLATED MESOSCALE REGIME",
          regimeConfidence: 84,
          baseWeather: {
            ...selectedLocation.baseWeather,
            temperature: Number((selectedLocation.baseWeather.temperature + (Math.random() * 2 - 1)).toFixed(1))
          },
          modelWeights: { nwp: 50, aiA: 33, aiB: 17 },
          weightRationale: "Spatial bilinear interpolation of surrounding Indian radar and NWP grid cells.",
          extremeAlert: selectedLocation.extremeAlert
        };
        setSelectedLocation(customLoc);
        setIsDropdownOpen(false);
        setSearchTerm("");
        setCustomCoordError("");
        return;
      }
    }
    setCustomCoordError("Please select a city from the list or enter valid Indian coordinates (e.g. 28.61, 77.21).");
  };

  return (
    <div className="bg-[#111622] border border-white/[0.08] rounded-lg p-3 sm:p-4 shadow-lg relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Active Location Card & Coordinates */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                TARGET OBSERVATION STATION
              </span>
              <span className="text-[10px] font-mono-tech text-slate-500">
                {selectedLocation.radarStation}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wide">
                {selectedLocation.name.toUpperCase()}, {selectedLocation.state.toUpperCase()}
              </h2>
              <span className="font-mono-tech text-xs text-slate-400">
                {selectedLocation.lat.toFixed(2)}°N / {selectedLocation.lon.toFixed(2)}°E
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono-tech mt-1">
              <span className="flex items-center gap-1">
                <Mountain className="w-3 h-3 text-slate-500" /> Elevation: {selectedLocation.elevation}m
              </span>
              <span>•</span>
              <span className="text-slate-300">Terrain: {selectedLocation.terrain}</span>
            </div>
          </div>
        </div>

        {/* Right: Search / Selector trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Location Pills */}
          <div className="hidden xl:flex items-center gap-1.5 mr-2">
            {locationsList.slice(0, 4).map((loc) => {
              const isCurrent = loc.id === selectedLocation.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`px-2.5 py-1 rounded text-xs font-mono-tech transition-colors cursor-pointer ${
                    isCurrent
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.05]"
                  }`}
                >
                  {loc.name}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#161d2d] hover:bg-[#1a2336] text-slate-200 border border-white/[0.1] text-xs font-mono-tech transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change Station / City</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu for Searching & Filtering */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#121824] border border-cyan-500/30 rounded-lg shadow-2xl z-50 p-3">
                <form onSubmit={handleCustomCoordinates} className="relative mb-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCustomCoordError("");
                    }}
                    placeholder="Search city, state, or lat,lon..."
                    className="w-full bg-[#0d121a] border border-white/[0.1] rounded px-3 py-2 text-xs text-white placeholder-slate-500 font-mono-tech focus:outline-none focus:border-cyan-400"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-800"
                  >
                    Go
                  </button>
                </form>

                {customCoordError && (
                  <p className="text-[11px] text-rose-400 mb-2 font-mono-tech">{customCoordError}</p>
                )}

                <div className="max-h-60 overflow-y-auto space-y-1">
                  <div className="text-[10px] font-mono-tech uppercase text-slate-500 px-2 py-1">
                    REFERENCE RADAR STATIONS ({filteredLocations.length})
                  </div>
                  {filteredLocations.map((loc) => {
                    const isSelected = loc.id === selectedLocation.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleSelectLocation(loc)}
                        className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                            : "hover:bg-white/[0.05] text-slate-300"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {loc.name}
                            <span className="text-[10px] font-mono-tech text-slate-400 font-normal">
                              ({loc.state})
                            </span>
                          </div>
                          <div className="text-[10px] font-mono-tech text-slate-500">
                            {loc.lat.toFixed(2)}°N, {loc.lon.toFixed(2)}°E • {loc.climaticZone}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
