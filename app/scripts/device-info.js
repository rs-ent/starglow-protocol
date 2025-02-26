export function getPlatform(deviceInfo) {
    const { userAgent } = deviceInfo;
    if (!userAgent) return "Unknown";

    const ua = userAgent.toLowerCase();

    if (ua.includes("windows phone")) return "Windows Phone";
    if (ua.includes("android")) return "Android";
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return "iOS";
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("macintosh") || ua.includes("mac os x")) return "Mac";
    if (ua.includes("cros")) return "Chrome OS";
    if (ua.includes("linux")) return "Linux";
    if (ua.includes("playstation")) return "PlayStation";
    if (ua.includes("xbox")) return "Xbox";
    if (ua.includes("smart-tv") || ua.includes("smarttv") || ua.includes("hbbtv")) return "Smart TV";

    return "Unknown";
}

export async function getGeographic(ipAddress) {
    if (!ipAddress || ipAddress === "unknown") {
      return {
        country: "Unknown",
        region: "Unknown",
        city: "Unknown",
        postal: "Unknown",
        latitude: "Unknown",
        longitude: "Unknown",
      };
    }
  
    let geoInfo = {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
      postal: "Unknown",
      latitude: "Unknown",
      longitude: "Unknown",
    };
  
    try {
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error from ipapi (non-OK response):", errorText);
        return geoInfo;
      }
      
      const data = await response.json();
  
      if (data.error) {
        console.error("Error from ipapi:", data.reason);
        return geoInfo;
      }
  
      geoInfo = {
        country: data.country_name || "Unknown",
        region: data.region || "Unknown",
        city: data.city || "Unknown",
        postal: data.postal || "Unknown",
        latitude: data.latitude || "Unknown",
        longitude: data.longitude || "Unknown",
      };
  
      return geoInfo;
    } catch (error) {
      console.error("Error fetching geographic info:", error);
      return geoInfo;
    }
  }
  