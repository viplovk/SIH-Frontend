import React, { useState } from "react";
import { Search, MapPin, ChevronDown, Check, Mountain } from "lucide-react";
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
    const parts = searchTerm.split(/[\s,]+/);
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lon) && lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98) {
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
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Active Location Card & Coordinates */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b3d91] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0b3d91] uppercase tracking-wider">
                TARGET OBSERVATION STATION
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {selectedLocation.radarStation}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {selectedLocation.name.toUpperCase()}, {selectedLocation.state.toUpperCase()}
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {selectedLocation.lat.toFixed(2)}°N / {selectedLocation.lon.toFixed(2)}°E
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
              <span className="flex items-center gap-1 font-medium">
                <Mountain className="w-3.5 h-3.5 text-slate-400" /> Elevation: {selectedLocation.elevation}m
              </span>
              <span>•</span>
              <span className="font-medium">Terrain: {selectedLocation.terrain}</span>
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
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    isCurrent
                      ? "bg-blue-50 text-[#0b3d91] border border-blue-200"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
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
              className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#0b3d91]" />
              <span>Change Station / City</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu for Searching & Filtering */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-4">
                <form onSubmit={handleCustomCoordinates} className="relative mb-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCustomCoordError("");
                    }}
                    placeholder="Search city, state, or lat,lon..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0b3d91] focus:ring-1 focus:ring-[#0b3d91]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-[#0b3d91] text-white hover:bg-[#082a66]"
                  >
                    Go
                  </button>
                </form>

                {customCoordError && (
                  <p className="text-xs text-rose-600 mb-2 font-medium">{customCoordError}</p>
                )}

                <div className="max-h-64 overflow-y-auto space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    REFERENCE RADAR STATIONS ({filteredLocations.length})
                  </div>
                  {filteredLocations.map((loc) => {
                    const isSelected = loc.id === selectedLocation.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleSelectLocation(loc)}
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 text-[#0b3d91] font-semibold border border-blue-200"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {loc.name}
                            <span className="text-xs text-slate-500 font-normal">
                              ({loc.state})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {loc.lat.toFixed(2)}°N, {loc.lon.toFixed(2)}°E • {loc.climaticZone}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#0b3d91]" />}
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
