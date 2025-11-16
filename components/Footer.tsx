
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [footerSettings, setFooterSettings] = useState({
    aboutUs: {
      isVisible: true,
      title: 'Quiénes Somos',
      content: 'Somos un restaurante especializado en comida rápida de calidad, ofreciendo hamburguesas, hot dogs y burritos con sabor auténtico.'
    },
    contact: {
      isVisible: true,
      phone: '+48 794 965 638',
      email: 'contacto@jos-restaurant.com',
      address: 'Sosnowiec, Polonia'
    },
    policies: {
      isVisible: true,
      privacyPolicy: 'https://jos-restaurant.com/privacy',
      termsConditions: 'https://jos-restaurant.com/terms'
    },
    socialMedia: {
      isVisible: true,
      facebook: 'https://facebook.com/jos-restaurant',
      instagram: 'https://instagram.com/jos-restaurant',
      twitter: 'https://twitter.com/jos-restaurant',
      whatsapp: '+48794965638'
    },
    logo: {
      isVisible: true,
      logoImage: '',
      brandName: 'JOS'
    }
  });

  const [businessData, setBusinessData] = useState({
    name: 'JOS Restaurant',
    nip: '',
    regon: '',
    footerLegalText: '',
    showNip: false,
    showRegon: false,
    showFooterLegal: true
  });

  useEffect(() => {
    const savedFooterSettings = localStorage.getItem('footerSettings');
    if (savedFooterSettings) {
      try {
        setFooterSettings(JSON.parse(savedFooterSettings));
      } catch (e) {
        console.error('Error parsing footerSettings:', e);
      }
    }

    // También cargar configuraciones existentes para mantener consistencia
    const savedHomePage = localStorage.getItem('homePageSettings');
    if (savedHomePage) {
      try {
        const homePageData = JSON.parse(savedHomePage);
        setFooterSettings(prev => ({
          ...prev,
          logo: {
            ...prev.logo,
            logoImage: homePageData.logoImage || '',
            brandName: homePageData.brandName || 'JOS'
          }
        }));
      } catch (e) {
        console.error('Error parsing homePageSettings:', e);
      }
    }

    const savedAboutUs = localStorage.getItem('aboutUsSettings');
    if (savedAboutUs) {
      try {
        const aboutUsData = JSON.parse(savedAboutUs);
        if (aboutUsData.isVisible && aboutUsData.content) {
          setFooterSettings(prev => ({
            ...prev,
            aboutUs: {
              ...prev.aboutUs,
              title: aboutUsData.title || 'Quiénes Somos',
              content: aboutUsData.content
            }
          }));
        }
      } catch (e) {
        console.error('Error parsing aboutUsSettings:', e);
      }
    }

    const savedBusinessSettings = localStorage.getItem('businessSettings');
    if (savedBusinessSettings) {
      try {
        const businessDataParsed = JSON.parse(savedBusinessSettings);
        setBusinessData(prev => ({ ...prev, ...businessDataParsed }));
        setFooterSettings(prev => ({
          ...prev,
          contact: {
            ...prev.contact,
            phone: `+48 ${businessDataParsed.whatsapp}` || prev.contact.phone,
            address: `${businessDataParsed.city}, ${businessDataParsed.country}` || prev.contact.address
          }
        }));
      } catch (e) {
        console.error('Error parsing businessSettings:', e);
      }
    }
  }, []);

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo y Marca */}
          {footerSettings.logo.isVisible && (
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                {footerSettings.logo.logoImage ? (
                  <img 
                    src={footerSettings.logo.logoImage}
                    alt={`${footerSettings.logo.brandName} Logo`}
                    className="w-12 h-12 object-cover rounded-full border-2 border-yellow-400 mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 mr-3">
                    <div className="w-full h-full rounded-full border-2 border-yellow-400 flex items-center justify-center" 
                         style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
                      <i className="ri-fire-line text-lg text-black"></i>
                    </div>
                  </div>
                )}
                <h3 className="font-['Pacifico'] text-2xl text-yellow-400">
                  {footerSettings.logo.brandName}
                </h3>
              </div>
            </div>
          )}

          {/* Quiénes Somos */}
          {footerSettings.aboutUs.isVisible && footerSettings.aboutUs.content && (
            <div className="md:col-span-1">
              <h4 className="text-lg font-bold text-yellow-400 mb-4 border-b border-yellow-400 pb-2">
                Quiénes Somos
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {footerSettings.aboutUs.content}
              </p>
            </div>
          )}

          {/* Información de Contacto */}
          {footerSettings.contact.isVisible && (
            <div className="md:col-span-1">
              <h4 className="text-lg font-bold text-yellow-400 mb-4 border-b border-yellow-400 pb-2">
                Contacto
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <i className="ri-phone-line text-yellow-400 mr-3 w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-gray-300 text-sm">{footerSettings.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-mail-line text-yellow-400 mr-3 w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-gray-300 text-sm">{footerSettings.contact.email}</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-map-pin-line text-yellow-400 mr-3 w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-gray-300 text-sm">{footerSettings.contact.address}</span>
                </div>
                
                {/* Información Reglamentaria */}
                {businessData.showNip && businessData.nip && (
                  <div className="flex items-center">
                    <i className="ri-file-text-line text-yellow-400 mr-3 w-5 h-5 flex items-center justify-center"></i>
                    <span className="text-gray-300 text-sm">NIP: {businessData.nip}</span>
                  </div>
                )}
                
                {businessData.showRegon && businessData.regon && (
                  <div className="flex items-center">
                    <i className="ri-file-list-line text-yellow-400 mr-3 w-5 h-5 flex items-center justify-center"></i>
                    <span className="text-gray-300 text-sm">REGON: {businessData.regon}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Redes Sociales y Políticas */}
          <div className="md:col-span-1">
            {/* Redes Sociales */}
            {footerSettings.socialMedia.isVisible && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-yellow-400 mb-4 border-b border-yellow-400 pb-2">
                  Síguenos
                </h4>
                <div className="flex space-x-4">
                  {footerSettings.socialMedia.facebook && (
                    <a 
                      href={footerSettings.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer"
                    >
                      <i className="ri-facebook-fill"></i>
                    </a>
                  )}
                  {footerSettings.socialMedia.instagram && (
                    <a 
                      href={footerSettings.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer"
                    >
                      <i className="ri-instagram-line"></i>
                    </a>
                  )}
                  {footerSettings.socialMedia.twitter && (
                    <a 
                      href={footerSettings.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer"
                    >
                      <i className="ri-twitter-line"></i>
                    </a>
                  )}
                  {footerSettings.socialMedia.whatsapp && (
                    <a 
                      href={`https://wa.me/${footerSettings.socialMedia.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer"
                    >
                      <i className="ri-whatsapp-line"></i>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Políticas */}
            {footerSettings.policies.isVisible && (
              <div>
                <h4 className="text-lg font-bold text-yellow-400 mb-4 border-b border-yellow-400 pb-2">
                  Políticas
                </h4>
                <div className="space-y-2">
                  {footerSettings.policies.privacyPolicy && (
                    <a 
                      href={footerSettings.policies.privacyPolicy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-300 text-sm hover:text-yellow-400 transition-colors cursor-pointer"
                    >
                      Política de Privacidad
                    </a>
                  )}
                  {footerSettings.policies.termsConditions && (
                    <a 
                      href={footerSettings.policies.termsConditions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-300 text-sm hover:text-yellow-400 transition-colors cursor-pointer"
                    >
                      Términos y Condiciones
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              {businessData.showFooterLegal && businessData.footerLegalText ? (
                <div className="text-gray-400 text-xs leading-relaxed">
                  {businessData.footerLegalText.split('\n').map((line, index) => (
                    <p key={index} className="mb-1">{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  © 2024 {footerSettings.logo.brandName}. Todos los derechos reservados
                </p>
              )}
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <span>Hecho con</span>
              <Link 
                href="https://readdy.ai/?origin=logo" 
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer font-medium"
              >
                Readdy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
