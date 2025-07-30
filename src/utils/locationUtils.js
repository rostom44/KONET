import {
  CITY_DISPLAY_NAMES,
  QUICK_CITIES,
  KNOWN_AREAS,
} from "../data/cities.js";

// Configuration
export const CONFIG = {
  LYON_CENTER: { lat: 45.7578, lng: 4.832 },
  SERVICE_RADIUS_KM: 20,
  PHONE: "04 XX XX XX XX",
  CONTACT_URL: "/contact",
  STORAGE_KEYS: {
    LOCATION_CHECKED: "locationChecked",
    LOCATION_DENIED: "locationDenied",
  },
};

// Input sanitization
export function sanitizeInput(input) {
  if (!input || typeof input !== "string") return "";
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
}

// Geolocation service
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Géolocalisation non supportée"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        let message = "Erreur de géolocalisation";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Géolocalisation refusée";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Position indisponible";
            break;
          case error.TIMEOUT:
            message = "Délai d'attente dépassé";
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

// String normalization for city matching
export function normalizeString(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]/g, "");
}

// Check if city is in known service area
export function isKnownArea(cityName) {
  const normalized = normalizeString(cityName);
  if (normalized.length < 2) return false;

  return KNOWN_AREAS.some((area) => {
    const normalizedArea = normalizeString(area);
    return normalizedArea === normalized;
  });
}

// Fuzzy matching algorithm for city suggestions
export function fuzzyMatch(input, target, threshold = 0.6) {
  const normalizedInput = normalizeString(input);
  const normalizedTarget = normalizeString(target);

  if (normalizedInput === normalizedTarget) return 1;
  if (normalizedTarget.includes(normalizedInput)) return 0.9;
  if (normalizedInput.includes(normalizedTarget)) return 0.8;

  // Simple character similarity
  const longer =
    normalizedInput.length > normalizedTarget.length
      ? normalizedInput
      : normalizedTarget;
  const shorter =
    normalizedInput.length > normalizedTarget.length
      ? normalizedTarget
      : normalizedInput;

  if (longer.length === 0) return 1;

  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }

  const similarity = matches / longer.length;
  return similarity >= threshold ? similarity : 0;
}

// Get city suggestions based on input
export function getSuggestions(input) {
  if (!input || input.length < 2) return [];

  const suggestions = CITY_DISPLAY_NAMES.map((city) => ({
    name: city,
    score: fuzzyMatch(input, city),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.name);

  return suggestions;
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check if location is within service area
export function isWithinServiceArea(coords) {
  const distance = calculateDistance(
    CONFIG.LYON_CENTER.lat,
    CONFIG.LYON_CENTER.lng,
    coords.latitude,
    coords.longitude
  );

  return {
    distance: parseFloat(distance.toFixed(1)),
    withinArea: distance <= CONFIG.SERVICE_RADIUS_KM,
  };
}

// Location storage management
export const locationStorage = {
  isLocationChecked: () =>
    localStorage.getItem(CONFIG.STORAGE_KEYS.LOCATION_CHECKED) === "1",
  isLocationDenied: () =>
    localStorage.getItem(CONFIG.STORAGE_KEYS.LOCATION_DENIED) === "1",
  setLocationChecked: () =>
    localStorage.setItem(CONFIG.STORAGE_KEYS.LOCATION_CHECKED, "1"),
  setLocationDenied: () =>
    localStorage.setItem(CONFIG.STORAGE_KEYS.LOCATION_DENIED, "1"),
  clearLocationData: () => {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.LOCATION_CHECKED);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.LOCATION_DENIED);
  },
};

// Main location checking logic
export async function checkLocationByCoords() {
  try {
    const coords = await getCurrentLocation();
    const result = isWithinServiceArea(coords);

    if (result.withinArea) {
      locationStorage.setLocationChecked();
      return {
        success: true,
        type: "coordinates",
        message: `✅ Parfait ! Vous êtes à ${result.distance}km de Lyon - nous intervenons dans votre secteur !`,
        distance: result.distance,
      };
    } else {
      return {
        success: false,
        type: "coordinates",
        message: `❌ Désolé, vous êtes à ${result.distance}km de Lyon, ce qui dépasse notre zone de ${CONFIG.SERVICE_RADIUS_KM}km.`,
        distance: result.distance,
        note: "Contactez-nous quand même - nous pouvons faire des exceptions pour les gros chantiers !",
      };
    }
  } catch (error) {
    return {
      success: false,
      type: "error",
      message: error.message,
      requiresManualInput: true,
    };
  }
}

// Check location by city name
export function checkLocationByCity(cityName) {
  const sanitizedCity = sanitizeInput(cityName);

  if (!sanitizedCity) {
    return {
      success: false,
      type: "validation",
      message: "Veuillez saisir le nom de votre ville",
    };
  }

  if (isKnownArea(sanitizedCity)) {
    locationStorage.setLocationChecked();
    return {
      success: true,
      type: "city",
      message: `✅ Excellent ! Nous intervenons à ${sanitizedCity}.`,
      city: sanitizedCity,
    };
  } else {
    return {
      success: false,
      type: "unknown_city",
      message: `⚠️ Nous n'avons pas pu vérifier automatiquement "${sanitizedCity}".`,
      city: sanitizedCity,
      note: `Appelez-nous au ${CONFIG.PHONE} pour confirmer votre secteur.`,
      details: "Nous intervenons dans un rayon de 20km autour de Lyon.",
    };
  }
}

// Export quick cities and city display names for UI components
export { QUICK_CITIES, CITY_DISPLAY_NAMES };

// Utility function to check if location modal should be shown
export function shouldShowLocationModal() {
  return (
    !locationStorage.isLocationChecked() && !locationStorage.isLocationDenied()
  );
}
