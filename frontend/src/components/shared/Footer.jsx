// import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:justify-between">

        {/* Logo */}

        <div className="space-y-3">
          <Link to="/">
            <h2 className="text-2xl font-bold">
              Job
              <span className="text-primary">Portal</span>
            </h2>
          </Link>

          <p className="max-w-sm text-sm text-muted-foreground">
            Find your dream job, connect with top companies,
            and build your career with confidence.
          </p>

          <p className="text-sm text-muted-foreground">
            © {year} JobPortal. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}

        <div>
          <h3 className="mb-4 font-semibold">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="hover:text-primary transition-colors"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/jobs"
                className="hover:text-primary transition-colors"
              >
                Jobs
              </Link>
            </li>

            <li>
              <Link
                to="/browse"
                className="hover:text-primary transition-colors"
              >
                Browse
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}

        <div>
          <h3 className="mb-4 font-semibold">
            Support
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="#"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-primary transition-colors"
              >
                Terms & Conditions
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-primary transition-colors"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}

        <div>
          <h3 className="mb-4 font-semibold">
            Follow Us
          </h3>

          <div className="flex items-center gap-4">

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border p-2 transition-colors hover:bg-accent"
            >
              <FaFacebook className="size-5" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border p-2 transition-colors hover:bg-accent"
            >
              <FaTwitter className="size-5" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border p-2 transition-colors hover:bg-accent"
            >
              <FaLinkedin className="size-5" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border p-2 transition-colors hover:bg-accent"
            >
              <FaInstagram className="size-5" />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border p-2 transition-colors hover:bg-accent"
            >
              <FaGithub className="size-5" />
            </a>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;