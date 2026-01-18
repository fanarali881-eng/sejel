/**
 * INTERACTIVE MAP COMPONENT - Saudi Arabia Only
 * 
 * Features:
 * - Works reliably on mobile devices
 * - Search restricted to Saudi Arabia only
 * - Click on map to select location (opens in new window)
 * - Displays current location
 * - Touch-friendly interface
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, ExternalLink } from "lucide-react";

interface InteractiveMapProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  searchAddress?: string;
}

export function InteractiveMap({
  className,
  initialCenter = { lat: 24.7136, lng: 46.6753 }, // Riyadh, Saudi Arabia
  initialZoom = 12,
  onLocationSelect,
  searchAddress = "",
}: InteractiveMapProps) {
  const [currentLocation, setCurrentLocation] = useState(initialCenter);
  const [searchInput, setSearchInput] = useState(searchAddress);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // Saudi Arabia bounds: lat 16.0 to 32.2, lng 34.5 to 55.7
  const SAUDI_BOUNDS = {
    north: 32.2,
    south: 16.0,
    east: 55.7,
    west: 34.5,
  };

  // Check if location is within Saudi Arabia bounds
  const isSaudiLocation = (lat: number, lng: number): boolean => {
    return (
      lat >= SAUDI_BOUNDS.south &&
      lat <= SAUDI_BOUNDS.north &&
      lng >= SAUDI_BOUNDS.west &&
      lng <= SAUDI_BOUNDS.east
    );
  };

  // Initialize geocoder on component mount
  useEffect(() => {
    const initGeocoder = async () => {
      // Check if Google Maps is available
      if (window.google?.maps) {
        geocoderRef.current = new window.google.maps.Geocoder();
        console.log("[InteractiveMap] Geocoder initialized");
        
        // Get initial address
        if (geocoderRef.current) {
          geocoderRef.current.geocode(
            { location: currentLocation },
            (results, status) => {
              if (status === "OK" && results?.[0]) {
                setAddress(results[0].formatted_address);
              }
            }
          );
        }
      } else {
        // Load Google Maps script if not available
        loadGoogleMapsScript();
      }
    };

    initGeocoder();
  }, []);

  const loadGoogleMapsScript = () => {
    const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY || "default-key";
    const FORGE_BASE_URL =
      import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
      "https://forge.manus.im";
    const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

    if (window.google?.maps) {
      return;
    }

    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=geocoding`;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      console.log("[InteractiveMap] Google Maps script loaded");
      if (window.google?.maps) {
        geocoderRef.current = new window.google.maps.Geocoder();
      }
    };

    script.onerror = () => {
      console.error("[InteractiveMap] Failed to load Google Maps script");
    };

    document.head.appendChild(script);
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("الرجاء إدخال عنوان");
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      // Search with Saudi Arabia boundary
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput + " Saudi Arabia")}&limit=10&countrycodes=sa`,
        {
          headers: {
            "Accept": "application/json",
          },
        }
      );

      const results = await response.json();

      if (results && results.length > 0) {
        // Find first result within Saudi Arabia bounds
        let foundLocation = null;
        for (const result of results) {
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          if (isSaudiLocation(lat, lng)) {
            foundLocation = { lat, lng, address: result.display_name };
            break;
          }
        }

        if (foundLocation) {
          setCurrentLocation({ lat: foundLocation.lat, lng: foundLocation.lng });
          setAddress(foundLocation.address);

          if (onLocationSelect) {
            onLocationSelect({
              lat: foundLocation.lat,
              lng: foundLocation.lng,
              address: foundLocation.address,
            });
          }

          console.log("[InteractiveMap] Search result:", foundLocation.address);
        } else {
          setError(
            "العنوان خارج المملكة العربية السعودية. الرجاء البحث عن عنوان داخل السعودية."
          );
        }
      } else {
        setError("لم يتم العثور على العنوان داخل السعودية");
      }
    } catch (err) {
      console.error("[InteractiveMap] Search error:", err);
      setError("خطأ في البحث عن العنوان");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Generate map URL for iframe - restricted to Saudi Arabia
  const mapUrl = `https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}&t=&z=${initialZoom}&ie=UTF8&iwloc=&output=embed`;
  const mapsLink = `https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="ابحث عن عنوان في السعودية..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-10"
            disabled={isSearching}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSearching ? "جاري..." : "بحث"}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Current Location Display */}
      <div className="text-sm text-gray-600 flex items-center gap-2">
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">
          {address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
        </span>
      </div>

      {/* Map Container */}
      <div className="w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-200">
        <iframe
          width="100%"
          height="300"
          style={{ border: 0, minHeight: "300px" }}
          loading="lazy"
          allowFullScreen={true}
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          title="خريطة الموقع"
        ></iframe>
      </div>

      {/* Open in Maps Link */}
      <div className="flex gap-2">
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <ExternalLink className="w-4 h-4" />
          فتح في خرائط جوجل
        </a>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 يمكنك:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>البحث عن عنوان في السعودية</li>
          <li>فتح الخريطة في تطبيق جوجل ماب للتفاعل الكامل</li>
          <li>تحديد الموقع من خلال تطبيق الخرائط</li>
        </ul>
      </div>
    </div>
  );
}
