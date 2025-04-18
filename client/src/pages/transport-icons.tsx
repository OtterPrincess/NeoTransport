import React from "react";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import Footer from "@/components/dashboard/footer";
import TransportIconShowcase from "@/components/transport/transport-icon-showcase";

export default function TransportIcons() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-4 flex-grow">
        <TransportIconShowcase />
      </main>
      
      <Footer />
    </div>
  );
}