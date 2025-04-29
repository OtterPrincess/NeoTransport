import React from "react";
import { Link } from "wouter";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-[#616161]">
        <div>© {new Date().getFullYear()} Nestara Health - Neonatal Transport Platform</div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-[#6A1B9A]">Help</a>
          <Link href="/privacy-policy" className="hover:text-[#6A1B9A]">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-[#6A1B9A]">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
