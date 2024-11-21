"use client";
import React from "react";
import Image from "next/image";
import OAuthButtonForm from "./OAuthButtonForm";

interface OAuthButtonProps {
  provider: string;
  callbackUrl?: string;
}
const providerData: Record<string, { name: string; imageSrc: string; bgColor: string }> = {
  google: {
    name: "Google",
    imageSrc: "/icons/providers/google.icon.png",
    bgColor: "bg-blue-600 hover:bg-blue-700",
  },
  discord: {
    name: "Discord",
    imageSrc: "/icons/providers/discord.icon.png",
    bgColor: "bg-[#5165f6] hover:bg-[#323fa1]",
  },
};

export default function OAuthButton(props: OAuthButtonProps) {
  const provider = providerData[props.provider.toLowerCase()];

  if (!provider) {
    return <p>Unsupported provider</p>;
  }

  const handleSignIn = async () => {
    await OAuthButtonForm({ provider: provider.name.toLowerCase(), callbackUrl: props.callbackUrl });
  };

  return (
    <>
      {/* OAuth Login */}
      <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
        <button
          type="submit"
          className={`flex items-center mb-2 border border-transparent rounded-lg shadow-sm px-4 py-3
            ${provider.bgColor} text-white font-medium transition duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-fit pr-[50px] text-md h-auto
            justify-center space-x-8`}
        >
          <Image
            alt={`${provider.name} logo`}
            src={provider.imageSrc}
            width={50}
            height={50}
          />
          <p className="text-center">
            Sign in with {provider.name}
          </p>
        </button>
      </form>
    </>
  );
}