/**
 * INTERACTIVE MAP COMPONENT - Saudi Arabia Only with Full Interactivity
 * 
 * Features:
 * - Click on map to place marker
 * - Drag marker to move location
 * - Search for address
 * - Works on mobile and desktop
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

declare global {
  interface Window {
    google?: typeof google;
  }
}

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const [currentLocation, setCurrentLocation] = useState(initialCenter);
  const [searchInput, setSearchInput] = useState(searchAddress);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

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

  // Get address from coordinates
  const getAddressFromCoordinates = (lat: number, lng: number) => {
    if (geocoder.current) {
      geocoder.current.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            const resultAddress = results[0].formatted_address;
            setAddress(resultAddress);
            if (onLocationSelect) {
              onLocationSelect({ lat, lng, address: resultAddress });
            }
          }
        }
      );
    }
  };

  // Load Google Maps script
  const loadMapScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google?.maps) {
        console.log("[InteractiveMap] Google Maps already loaded");
        resolve();
        return;
      }

      const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY || "default-key";
      const FORGE_BASE_URL =
        import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
        "https://forge.manus.im";
      const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

      const script = document.createElement("script");
      script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,geocoding`;
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        console.log("[InteractiveMap] Script loaded");
        let attempts = 0;
        const checkGoogle = () => {
          attempts++;
          if (window.google?.maps) {
            console.log("[InteractiveMap] Google Maps ready");
            resolve();
          } else if (attempts < 100) {
            setTimeout(checkGoogle, 100);
          } else {
            reject(new Error("Timeout waiting for Google Maps"));
          }
        };
        checkGoogle();
      };

      script.onerror = () => {
        console.error("[InteractiveMap] Failed to load Google Maps script");
        reject(new Error("Failed to load Google Maps"));
      };

      document.head.appendChild(script);
    });
  };

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        console.log("[InteractiveMap] Initializing map");
        await loadMapScript();

        if (!mapContainer.current || !window.google?.maps) {
          console.error("[InteractiveMap] Map container or Google Maps not available");
          return;
        }

        // Create map
        map.current = new window.google.maps.Map(mapContainer.current, {
          zoom: initialZoom,
          center: initialCenter,
          mapTypeControl: true,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "greedy",
          mapId: "INTERACTIVE_MAP_ID",
        });

        // Initialize geocoder
        geocoder.current = new window.google.maps.Geocoder();

        // Create marker
        marker.current = new window.google.maps.marker.AdvancedMarkerElement({
          map: map.current,
          position: initialCenter,
          title: "اختر الموقع",
          gmpDraggable: true,
        });

        // Handle marker drag end
        marker.current.addListener("dragend", () => {
          if (marker.current?.position) {
            const pos = marker.current.position;
            const lat = typeof pos.lat === "function" ? pos.lat() : pos.lat;
            const lng = typeof pos.lng === "function" ? pos.lng() : pos.lng;

            setCurrentLocation({ lat, lng });
            map.current?.setCenter({ lat, lng });
            getAddressFromCoordinates(lat, lng);
          }
        });

        // Handle map click
        map.current.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            if (!isSaudiLocation(lat, lng)) {
              setError("الموقع خارج المملكة العربية السعودية");
              return;
            }

            setCurrentLocation({ lat, lng });
            setError("");

            if (marker.current) {
              marker.current.position = { lat, lng };
            }

            getAddressFromCoordinates(lat, lng);
          }
        });

        // Get initial address
        getAddressFromCoordinates(initialCenter.lat, initialCenter.lng);
        setMapLoaded(true);
        console.log("[InteractiveMap] Map initialized successfully");
      } catch (error) {
        console.error("[InteractiveMap] Error initializing map:", error);
        setError("فشل تحميل الخريطة");
      }
    };

    initMap();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("الرجاء إدخال عنوان");
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      if (!geocoder.current) {
        setError("خدمة الخريطة غير متاحة");
        setIsSearching(false);
        return;
      }

      geocoder.current.geocode(
        { address: searchInput + " Saudi Arabia" },
        (results, status) => {
          setIsSearching(false);

          if (status === "OK" && results?.[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            const resultAddress = results[0].formatted_address;

            // Check if location is in Saudi Arabia
            if (!isSaudiLocation(lat, lng)) {
              setError("العنوان خارج المملكة العربية السعودية. الرجاء البحث عن عنوان داخل السعودية.");
              return;
            }

            setCurrentLocation({ lat, lng });
            setAddress(resultAddress);

            if (map.current) {
              map.current.setCenter({ lat, lng });
              map.current.setZoom(15);
            }

            if (marker.current) {
              marker.current.position = { lat, lng };
            }

            if (onLocationSelect) {
              onLocationSelect({ lat, lng, address: resultAddress });
            }

            console.log("[InteractiveMap] Search result:", resultAddress);
          } else {
            setError("لم يتم العثور على العنوان");
            console.error("[InteractiveMap] Geocode error:", status);
          }
        }
      );
    } catch (err) {
      setIsSearching(false);
      setError("خطأ في البحث عن العنوان");
      console.error("[InteractiveMap] Search error:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
            disabled={isSearching || !mapLoaded}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !mapLoaded}
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
      <div
        ref={mapContainer}
        className={cn(
          "w-full h-[300px] md:h-[400px] bg-gray-200 rounded-lg overflow-hidden border border-gray-300",
          "touch-none"
        )}
        style={{ minHeight: "300px" }}
      />

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 يمكنك:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>البحث عن عنوان في السعودية</li>
          <li>النقر على الخريطة لتحديد موقع</li>
          <li>سحب الدبوس لتحريك الموقع</li>
        </ul>
      </div>
    </div>
  );
}
