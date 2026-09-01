import React from "react";

/**
 * Injects Product schema.org JSON-LD into <head> for Google Shopping eligibility.
 * Uses a <script> tag rendered into a hidden element, then moved to <head>.
 */
export default function ProductJsonLd({ product }) {
  if (!product) return null;

  const isAvailable = product.is_threshold_reached;
  const availability = isAvailable
    ? "https://schema.org/PreOrder"
    : "https://schema.org/PreOrder";

  const image = product.thumbnail_url || product.images?.[0] || "";

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `https://shop.indianspacehub.com/#/product/${product.slug}`,
    name: product.name,
    description: product.description || product.seo_description || product.name,
    image: product.images || [image],
    sku: product.slug,
    mpn: product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand || "Indian Space Hub",
    },
    url: `https://shop.indianspacehub.com/#/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      url: `https://shop.indianspacehub.com/#/product/${product.slug}`,
      priceCurrency: "INR",
      price: String(parseFloat(product.price || "0").toFixed(2)),
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      availability: availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Indian Space Hub Store",
        url: "https://shop.indianspacehub.com",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: "0",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          },
          cutoffTime: "18:00:00+05:30",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
        merchantReturnLink: "https://shop.indianspacehub.com/#/refund-policy",
      },
    },
    additionalProperty: product.available_sizes?.map((s) => ({
      "@type": "PropertyValue",
      name: "Size",
      value: s,
    })) || [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  );
}
