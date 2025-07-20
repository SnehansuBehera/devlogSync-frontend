import { FaXTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa6";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="bg-white border-t text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="space-y-4 col-span-1">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-nav.png"
              alt="logo"
              width={250}
              height={250}
              className="w-6 sm:w-8"
            />
            <span className="text-lg font-semibold text-black">DevlogSync</span>
          </div>
          <p className="text-gray-600 text-xs md:text-sm w-40">
            DevlogSync empowers developers and teams to automate daily work
            logs, integrate tools, and gain clarity with AI-generated summaries
            — all in one place.
          </p>
          {/* Social Icons */}
          <div className="flex gap-4 text-gray-600 text-xl sm:mt-8">
            <a href="https://x.com/SnehansuBehera1" aria-label="X">
              <FaXTwitter />
            </a>
            <a
              href="https://www.instagram.com/snehansu_08/"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/snehansu-behera-314b17258/"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a href="https://github.com/SnehansuBehera" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <h4 className="mt-1 sm:mt-0 text-black font-semibold mb-2">
            Product
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Integrations
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Changelog
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-black font-semibold mb-2">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Tutorials
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-black font-semibold mb-2">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Partners
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t py-6 px-6 text-center md:flex md:justify-between md:items-center max-w-7xl mx-auto">
        <p className="text-gray-500 text-xs">
          © 2025 DevlogSync. All rights reserved.
        </p>
        <div className="flex justify-center md:justify-end gap-4 mt-4 md:mt-0 text-xs">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Cookies Settings
          </a>
        </div>
      </div>
    </footer>
  );
}
