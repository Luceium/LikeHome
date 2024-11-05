"use client";
import { useState } from "react";
import {
  DEFAULT_DOMAIN,
  DEFAULT_LOCALE,
  DEFAULT_ADULTS_NUMBER,
  DEFAULT_BOOKING_NUM_DAYS,
  DEFAULT_ACCESSIBILITY_OPTIONS,
  DEFAULT_AMENITIES_OPTIONS,
  DEFAULT_MEAL_PLAN_OPTIONS,
  DEFAULT_LODGING_OPTIONS,
  DEFAULT_PAYMENT_TYPE_OPTIONS,
  DEFAULT_SORT_ORDER,
  DEFAULT_AVAILABILITY_FILTER_OPTIONS,
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE,
  DEFAULT_QUERY,
} from "@/lib/rapid-hotel-api/constants";
import {
  RegionSearchDomainType,
  RegionSearchLocaleType,
} from "@/lib/rapid-hotel-api/zod/region-search-schemas";
import {
  HotelSearchSortOrderOptionsType,
  HotelsSearchAccessibilityOptionsType,
  HotelsSearchAmenitiesOptionsType,
  HotelsSearchAvailableFilterOptionsType,
  HotelsSearchLodgingOptionsType,
  HotelsSearchMealPlanOptionsType,
  HotelsSearchPaymentTypeOptionsType,
} from "@/lib/rapid-hotel-api/zod/hotel-search-schemas";
import { generateDefaultDates } from "@/lib/DateFunctions";
import BookingInfoUISearchComplete from "@/components/search/BookingInfoSearch/BookingInfoSearchUIComplete";
import RegionSearchUIComplete from "@/components/search/RegionSearch/RegionSearchUIComplete";
import HotelSearchUIComplete from "@/components/search/HotelSearch/HotelSearchUIComplete";
import HotelResultUIComplete from "@/components/search/HotelResults/HotelResultsUIComplete";
import SearchParamsDisplay from "@/components/search/Testing/SearchParamsDisplay";

export type searchParamsType = {
  // RegionSearch inputs
  query: string;
  domain: RegionSearchDomainType;
  locale: RegionSearchLocaleType;
  selectedRegionId: string | null;

  // BookingInfo inputs
  checkinDate: string;
  checkoutDate: string;
  adultsNumber: number;
  numDays: number;

  // HotelSearch inputs
  accessibilityOptions: HotelsSearchAccessibilityOptionsType[];
  amenitiesOptions: HotelsSearchAmenitiesOptionsType[];
  mealPlanOptions: HotelsSearchMealPlanOptionsType[];
  lodgingOptions: HotelsSearchLodgingOptionsType[];
  paymentType: HotelsSearchPaymentTypeOptionsType[];
  sortOrder: HotelSearchSortOrderOptionsType;
  availableOnly: HotelsSearchAvailableFilterOptionsType[];
  price_min: number;
  price_max: number;
};

const FinalSearchTest: React.FC = () => {
  // Combined state to track inputs from all components
  const { DEFAULT_CHECKIN_BOOKING_DATE, DEFAULT_CHECKOUT_BOOKING_DATE } =
    generateDefaultDates(DEFAULT_BOOKING_NUM_DAYS);

  const [searchParams, setSearchParams] = useState<searchParamsType>({
    // RegionSearch default inputs
    query: DEFAULT_QUERY,
    domain: DEFAULT_DOMAIN,
    locale: DEFAULT_LOCALE,
    selectedRegionId: "",

    // BookingInfo default inputs
    checkinDate: DEFAULT_CHECKIN_BOOKING_DATE,
    checkoutDate: DEFAULT_CHECKOUT_BOOKING_DATE,
    adultsNumber: DEFAULT_ADULTS_NUMBER,
    numDays: DEFAULT_BOOKING_NUM_DAYS,

    // HotelSearch default inputs
    accessibilityOptions: DEFAULT_ACCESSIBILITY_OPTIONS,
    amenitiesOptions: DEFAULT_AMENITIES_OPTIONS,
    mealPlanOptions: DEFAULT_MEAL_PLAN_OPTIONS,
    lodgingOptions: DEFAULT_LODGING_OPTIONS,
    paymentType: DEFAULT_PAYMENT_TYPE_OPTIONS,
    sortOrder: DEFAULT_SORT_ORDER,
    availableOnly: DEFAULT_AVAILABILITY_FILTER_OPTIONS,
    price_min: DEFAULT_MIN_PRICE,
    price_max: DEFAULT_MAX_PRICE,
  });

  // Handlers to update specific sections of searchParams
  const updateRegionSearchParams = (
    newSearchParams: Partial<typeof searchParams>
  ) => setSearchParams((prev) => ({ ...prev, ...newSearchParams }));

  const updateBookingInfoParams = (
    newSearchParams: Partial<typeof searchParams>
  ) => setSearchParams((prev) => ({ ...prev, ...newSearchParams }));

  const updateHotelSearchParams = (
    newSearchParams: Partial<typeof searchParams>
  ) => setSearchParams((prev) => ({ ...prev, ...newSearchParams }));

  return (
    <div className="bg-slate-gray">
      <h1 className="text-2xl font-bold mb-4">Final Search Test</h1>

      {/* RegionSearch Component */}
      <RegionSearchUIComplete
        regionSearchInputs={{
          query: searchParams.query,
          domain: searchParams.domain,
          locale: searchParams.locale,
        }}
        selectedRegionId={searchParams.selectedRegionId}
        setRegionSearchInputs={(newParams: {
          query: string;
          domain: RegionSearchDomainType;
          locale: RegionSearchLocaleType;
        }) =>
          updateRegionSearchParams({
            query: newParams.query,
            domain: newParams.domain,
            locale: newParams.locale,
          })
        }
        setSelectedRegionId={(regionId: string | null) =>
          updateRegionSearchParams({ selectedRegionId: regionId })
        }
      />

      {/* BookingInfo Component */}
      <BookingInfoUISearchComplete
        bookingInfo={{
          checkinDate: searchParams.checkinDate,
          checkoutDate: searchParams.checkoutDate,
          adultsNumber: searchParams.adultsNumber,
          numDays: searchParams.numDays,
        }}
        setBookingInfo={(newParams: {
          checkinDate: string;
          checkoutDate: string;
          adultsNumber: number;
          numDays: number;
        }) =>
          updateBookingInfoParams({
            checkinDate: newParams.checkinDate,
            checkoutDate: newParams.checkoutDate,
            adultsNumber: newParams.adultsNumber,
            numDays: newParams.numDays,
          })
        }
      />

      {/* HotelSearch Component */}
      <HotelSearchUIComplete
        hotelSearchInputs={{
          accessibilityOptions: searchParams.accessibilityOptions,
          amenitiesOptions: searchParams.amenitiesOptions,
          mealPlanOptions: searchParams.mealPlanOptions,
          lodgingOptions: searchParams.lodgingOptions,
          paymentType: searchParams.paymentType,
          sortOrder: searchParams.sortOrder,
          availableOnly: searchParams.availableOnly,
          price_min: searchParams.price_min,
          price_max: searchParams.price_max,
        }}
        setHotelSearchInputs={(newParams) =>
          updateHotelSearchParams({
            accessibilityOptions: newParams.accessibilityOptions,
            amenitiesOptions: newParams.amenitiesOptions,
            mealPlanOptions: newParams.mealPlanOptions,
            lodgingOptions: newParams.lodgingOptions,
            paymentType: newParams.paymentType,
            sortOrder: newParams.sortOrder,
            availableOnly: newParams.availableOnly,
            price_min: newParams.price_min,
            price_max: newParams.price_max,
          })
        }
      />

      {/* Displaying all search parameters */}
      <SearchParamsDisplay searchParams={searchParams} />

      {/* HotelSelectUIComplete Component */}
      <HotelResultUIComplete
        bookingParams={{
          checkin_date: searchParams.checkinDate,
          checkout_date: searchParams.checkoutDate,
          adults_number: searchParams.adultsNumber,
          region_id: searchParams.selectedRegionId ?? "",
          sort_order: searchParams.sortOrder,
          locale: searchParams.locale,
          domain: searchParams.domain,
          price_min: searchParams.price_min,
          price_max: searchParams.price_max,

          // Optional fields
          accessibility: searchParams.accessibilityOptions,
          amenities: searchParams.amenitiesOptions,
          lodging_type: searchParams.lodgingOptions,
          meal_plan: searchParams.mealPlanOptions,
          available_filter: searchParams.availableOnly,
        }}
        validRegionId={
          searchParams.selectedRegionId !== "" ||
          searchParams.selectedRegionId !== null
            ? true
            : false
        }
      />
    </div>
  );
};

export default FinalSearchTest;
