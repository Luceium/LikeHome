"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CachedHotel, CachedHotelRoomOffer, Reservation } from "@prisma/client";
import { retrieveSpecificReservation } from "@/server-actions/reservation-actions";
import {
  retrieveCacheHotelDetails,
  retrieveCacheHotelRoomOffer,
} from "@/server-actions/cache-actions";
import Link from "next/link";
import Image from "next/image";
import HTMLSafeDescription from "@/components/booking/HTMLDescription";
import EditAdultsNumber from "@/components/booking/EditAdultsNumber";
import DeleteReservation from "@/components/booking/EditCancelReservation";
import LoadingPage from "@/components/ui/Loading/LoadingPage";
import EditReservationSection from "@/components/booking/EditReservationSection";

const BookingIDPage = () => {
  const { bookingId: bookingIdSlug } = useParams();
  const { data: session, status } = useSession();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [hotel, setHotel] = useState<CachedHotel | null>(null);
  const [roomOffer, setRoomOffer] = useState<CachedHotelRoomOffer | null>(null);

  useEffect(() => {
    const fetchReservationAndDetails = async () => {
      if (!bookingIdSlug || !session?.user?.email) return;

      try {
        const reservationData = await retrieveSpecificReservation(
          bookingIdSlug as string,
          session.user.email
        );
        if (reservationData) {
          setReservation(reservationData);

          const hotelDetails = await retrieveCacheHotelDetails(
            reservationData.hotel_id
          );
          setHotel(hotelDetails || null);

          const roomOfferDetails = await retrieveCacheHotelRoomOffer(
            reservationData.room_id
          );
          setRoomOffer(roomOfferDetails || null);
        }
      } catch (error) {
        console.error("Error fetching reservation details:", error);
      }
    };

    fetchReservationAndDetails();
  }, [bookingIdSlug, session?.user?.email]);

  if (status === "loading") {
    return (
      <LoadingPage
        className="min-h-screen"
        size_style={{ width: "400px", height: "400px" }}
      />
    );
  }

  if (!session || !session.user?.email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">
          Please sign in to view your booking!
        </p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">
          No reservation found for Booking ID: {bookingIdSlug}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      {/* Hero Section */}
      {hotel?.images?.[0]?.url && (
        <div
          className="h-64 lg:h-96 bg-cover bg-center rounded-lg shadow-md mb-8"
          style={{ backgroundImage: `url(${hotel.images[0].url})` }}
        >
          <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white text-center">
              {hotel.tagline || "Reservation Details"}
            </h1>
          </div>
        </div>
      )}
      {/* <TestReservationDetailsDisplay reservation={reservation} /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Booking Details */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              {hotel?.tagline || "Hotel details not available"}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              {hotel?.location?.address
                ? `${hotel.location.address.addressLine}, ${hotel.location.address.city}, ${hotel.location.address.province}, ${hotel.location.address.countryCode}`
                : "Address not available"}
            </p>
            <p className="text-lg font-medium mb-4">
              Room:{" "}
              <span className="text-info">
                {roomOffer?.name || "Room details not available"}
              </span>
            </p>
            <HTMLSafeDescription html={roomOffer?.description} />

            <div className="grid grid-cols-2 gap-6 mt-8">
              <p className="text-md">
                <span className="font-bold text-primary">Check-in:</span>{" "}
                {reservation.checkin_date}
              </p>
              <p className="text-md">
                <span className="font-bold text-primary">Check-out:</span>{" "}
                {reservation.checkout_date}
              </p>
              <p className="text-md">
                <span className="font-bold text-primary">Number of Days:</span>{" "}
                {reservation.numDays}
              </p>
            </div>

            <div className="mt-8">
              <p className="text-2xl font-bold text-success">
                Total Cost: ${reservation.room_cost.toFixed(2)}
              </p>
              <p className="text-lg mt-2">
                Verified:{" "}
                <span
                  className={`${
                    reservation.verified ? "text-success" : "text-error"
                  } font-bold`}
                >
                  {reservation.verified ? "Yes" : "No"}
                </span>
              </p>
              {reservation.is_cancelled && (
                <p className="text-2xl font-bold text-error">
                  THIS RESERVATION HAS BEEN CANCELLED.
                </p>
              )}
              <p className="text-md mt-2 text-gray-600 dark:text-gray-400">
                Booking ID: {reservation.id}
              </p>
            </div>
          </div>
          <div className="flex flex-col mt-8 space-y-6">
            {/* Go Back to Profile Bookings */}
            <Link
              href="/profile?section=bookings"
              className="btn btn-primary w-full py-3 text-lg"
            >
              Back to Profile
            </Link>
            {/* Cancel Reservation */}
            <EditReservationSection reservation={reservation} />
          </div>
        </div>

        {/* Room Gallery */}
        {roomOffer?.galleryImages && roomOffer.galleryImages.length > 0 && (
          <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6 w-full">
            <h2 className="text-3xl font-semibold mb-6 text-primary">
              Room Gallery
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {roomOffer.galleryImages.map((image, index) => (
                <div key={index} className="flex justify-center">
                  <Image
                    src={image.url}
                    alt={image.description || "Room Image"}
                    width={400}
                    height={400}
                    quality={100}
                    className="w-auto rounded-lg shadow"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingIDPage;
