export const autoComplete = async (input: string) => {
  if (!input) return [];

  const apiKey = "AIzaSyDltI2vV-mbS5Qy-gz2lPMTf7RAbR4tZRs";
  const sessionToken = crypto.randomUUID();

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}&sessiontoken=${sessionToken}`;

  const res = await fetch(url);

  if (!res.ok) return [];

  const data = await res.json();
  return data.predictions || [];
};

// "use server";

// import { Client } from "@googlemaps/google-maps-services-js";

// const client = new Client();

// const autoComplete = async (input: string) => {
//   if (!input) return [];

//   try {
//     const res = await client.placeAutocomplete({
//       params: {
//         input,
//         key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//       },
//     });
//     return res.data.predictions;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };

// export { autoComplete };
