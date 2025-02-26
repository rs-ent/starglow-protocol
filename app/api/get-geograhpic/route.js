// app/api/get-geograhpic/route.js
import { getGeographic } from "../../scripts/device-info";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip");

  if (!ip) {
    return new Response(
      JSON.stringify({ error: "IP address is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const geoInfo = await getGeographic(ip);
    return new Response(JSON.stringify(geoInfo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching geographic info:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while fetching data." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
