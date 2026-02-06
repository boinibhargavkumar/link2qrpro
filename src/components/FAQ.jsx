import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is Link2QRpro?",
    answer: "Link2QRpro is a free, professional QR code generator that allows you to create high-quality QR codes instantly. You can generate single QR codes or batch generate multiple QR codes with custom colors, all without registration or payment."
  },
  {
    question: "Is Link2QRpro really free?",
    answer: "Yes! Link2QRpro is completely free to use. There are no hidden costs, no registration required, and no limitations on the number of QR codes you can generate. All features are available to everyone at no charge."
  },
  {
    question: "What can I use QR codes for?",
    answer: "QR codes can be used for various purposes including website URLs, product information, business cards, marketing campaigns, event registration, restaurant menus, WiFi passwords, contact information, app downloads, and much more."
  },
  {
    question: "Can I customize the colors of my QR codes?",
    answer: "Yes! With our Master QR feature, you can fully customize both the QR code color and background color. Choose from preset colors or use the color picker to create your perfect QR code design."
  },
  {
    question: "How do I generate multiple QR codes at once?",
    answer: "Use our Master QR Generator feature. Simply add multiple URLs, customize your colors if desired, and click the generate button. You can then download all QR codes individually or all at once with custom names."
  },
  {
    question: "What format are the QR codes downloaded in?",
    answer: "All QR codes are downloaded as high-resolution PNG images (400x400 pixels by default), which are perfect for both digital use and printing. The images maintain excellent quality even when scaled."
  },
  {
    question: "Do you store my data or URLs?",
    answer: "No, we do not store any of your data. Link2QRpro operates entirely in your browser. Your URLs and generated QR codes are never sent to our servers, ensuring complete privacy and security."
  },
  {
    question: "Can I use the QR codes commercially?",
    answer: "Absolutely! All QR codes generated with Link2QRpro can be used for commercial purposes without any restrictions. Use them in your marketing materials, products, or business operations freely."
  },
  {
    question: "Will the QR codes expire?",
    answer: "No, QR codes generated with Link2QRpro never expire. Once created, they will work indefinitely as long as the URL they point to remains active. However, note that if you change or delete the destination URL, the QR code won't work."
  },
  {
    question: "What types of URLs can I convert to QR codes?",
    answer: "You can convert any valid HTTP or HTTPS URL into a QR code. For security reasons, we only support web URLs (http:// and https://) to protect users from potential security threats."
  },
  {
    question: "Can I rename my QR codes before downloading?",
    answer: "Yes! In the Master QR Generator, you can click the edit icon next to each QR code to give it a custom name. This makes it easy to organize and identify your downloaded QR codes."
  },
  {
    question: "Does Link2QRpro work on mobile devices?",
    answer: "Yes! Link2QRpro is fully responsive and works perfectly on all devices including smartphones, tablets, and desktop computers. Generate and download QR codes on the go!"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-24 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-purple-200/70 text-lg">
          Everything you need to know about Link2QRpro
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/15"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left transition-all"
            >
              <span className="font-semibold text-white pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-purple-300 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-5 text-purple-100/80 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}