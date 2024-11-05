"use client";
import { useState, useEffect } from "react";
import { APIHotelSearchJSONFormatted } from "@/app/api/hotels/search/route";
import HotelList from "./HotelList/HotelList";
import { z } from "zod";
import { hotelSearchParamsRefinedSchema } from "@/lib/rapid-hotel-api/zod/hotel-search-schemas";
import { HOTEL_SEARCH_API_URL } from "@/lib/rapid-hotel-api/api-setup";

export type bookingParamsType = z.infer<typeof hotelSearchParamsRefinedSchema>;

type HotelSelectUICompleteProps = {
  bookingParams: bookingParamsType;
  validRegionId: boolean;
};

const HotelSelect: React.FC<HotelSelectUICompleteProps> = ({
  bookingParams,
  validRegionId,
}) => {
  const [hotelsData, setHotelsData] =
    useState<APIHotelSearchJSONFormatted | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isValidParams, setIsValidParams] = useState<boolean>(false);

  useEffect(() => {
    const isValid =
      hotelSearchParamsRefinedSchema.safeParse(bookingParams).success;
    setIsValidParams(isValid);
  }, [bookingParams]);

  const handleFindHotels = async () => {
    setLoading(true);
    setHotelsData(null);
    try {
      const urlParams = new URLSearchParams();
      Object.entries(bookingParams).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          if (Array.isArray(value)) {
            urlParams.append(key, value.join(","));
          } else {
            urlParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(
        `${HOTEL_SEARCH_API_URL}?${urlParams.toString()}`
      );
      if (!response.ok) {
        alert(
          `Failed to fetch hotels. Status: ${response?.status}. StatusText: ${
            response?.statusText
          } Url: ${HOTEL_SEARCH_API_URL}?${urlParams.toString()}`
        );
        setHotelsData(null);
      } else {
        const HOTEL_DATA: APIHotelSearchJSONFormatted = await response.json();

        setHotelsData(HOTEL_DATA);
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
      setHotelsData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Available Hotels</h2>

      {/* Button to Trigger Hotel Search */}
      <button
        onClick={handleFindHotels}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-red-500 disabled:cursor-not-allowed"
        disabled={loading || !isValidParams || !validRegionId}
      >
        {loading ? "Loading..." : "Find Hotels"}
      </button>

      {/* Hotel List Display */}
      <div className="mt-6">
        {loading ? (
          <p className="text-blue-600">Loading...</p>
        ) : hotelsData && hotelsData.properties.length > 0 ? (
          <HotelList hotelsData={hotelsData} bookingParams={bookingParams} />
        ) : (
          <p className="text-gray-500">No hotels found.</p>
        )}
      </div>
    </div>
  );
};

export default HotelSelect;