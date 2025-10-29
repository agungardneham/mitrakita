import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              MitraKita
            </h3>
            <p
              className="text-gray-400 text-sm"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Platform digital Kementerian Perindustrian RI untuk memfasilitasi
              kemitraan antara IKM dengan industri besar dan akademisi.
            </p>
          </div>
          <div>
            <h4
              className="font-semibold mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Tautan Cepat
            </h4>
            <ul
              className="space-y-2 text-sm text-gray-400"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              <li className="hover:text-green-400 transition">
                <Link to="/about">Tentang Kami</Link>
              </li>
              <li className="hover:text-green-400 cursor-pointer transition">
                Panduan Pengguna
              </li>
              <li className="hover:text-green-400 cursor-pointer transition">
                Syarat & Ketentuan
              </li>
              <li className="hover:text-green-400 cursor-pointer transition">
                Kebijakan Privasi
              </li>
            </ul>
          </div>
          <div>
            <h4
              className="font-semibold mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Kontak
            </h4>
            <p
              className="text-gray-400 text-sm mb-2"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Kementerian Perindustrian RI
            </p>
            <p
              className="text-gray-400 text-sm"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Email: info@mitrakita.kemenperin.go.id
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 MitraKita - Kementerian Perindustrian Republik Indonesia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
