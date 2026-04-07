import React from 'react';
import { ModernPricingPage } from '@/components/ui/animated-glassy-pricing';

interface OracleStoreProps {
  onClose: () => void;
  currentUser: any;
  setPurchasingPkg: (pkg: any) => void;
  setShowAuthModal: (val: boolean) => void;
  t: any;
}

export const OracleStore: React.FC<OracleStoreProps> = ({ 
  onClose, 
  currentUser, 
  setPurchasingPkg, 
  setShowAuthModal,
  t 
}) => {
  return (
    <div className="fixed inset-0 z-[1000] animate-in fade-in duration-300">
       <ModernPricingPage
         onClose={onClose}
         title={t.storeTitle || "Oracle Store"}
         subtitle="Cosmic wisdom is within your reach. Invest in your destiny."
         showAnimatedBackground={true}
         plans={[
           {
             planName: t.storeBasic,
             description: t.storeDescs?.b || "Temel kozmik paket.",
             price: "₺20",
             features: t.storeFeatures?.b || ["3 Kredi", "Hızlı Analiz", "Temel Yorum"],
             buttonText: "Satın Al",
             buttonVariant: "secondary",
             onClick: () => {
               if(!currentUser) return setShowAuthModal(true);
               setPurchasingPkg({amount:3, tier:'free', name:t.storeBasic, price:'₺20'});
             }
           },
           {
             planName: t.storeCareer,
             description: t.storeDescs?.c || "Kariyer ve başarı odaklı.",
             price: "₺80",
             features: t.storeFeatures?.c || ["5 Kredi", "Kariyer Analizi", "Özel Odak"],
             buttonText: "Satın Al",
             buttonVariant: "secondary",
             onClick: () => {
               if(!currentUser) return setShowAuthModal(true);
               setPurchasingPkg({amount:5, tier:'free', name:t.storeCareer, price:'₺80'});
             }
           },
           {
             planName: t.storePremium,
             description: t.storeDescs?.p || "Sınırsız kozmik deneyim.",
             price: "₺99",
             features: t.storeFeatures?.p || ["Sınırsız Kredi", "Premium Rozet", "Öncelikli Destek"],
             buttonText: "Abone Ol",
             isPopular: true,
             buttonVariant: "primary",
             onClick: () => {
               if(!currentUser) return setShowAuthModal(true);
               setPurchasingPkg({amount:0, tier:'premium', name:t.storePremium, price:'₺99 / mo'});
             }
           },
           {
             planName: t.storeSupreme,
             description: t.storeDescs?.s || "En yüksek verimli paket.",
             price: "₺50",
             features: t.storeFeatures?.s || ["10 Kredi", "Derin Analiz", "Tüm Sırlar"],
             buttonText: "Satın Al",
             buttonVariant: "secondary",
             onClick: () => {
               if(!currentUser) return setShowAuthModal(true);
               setPurchasingPkg({amount:10, tier:'free', name:t.storeSupreme, price:'₺50'});
             }
           },
           {
             planName: t.storePremiumExtra,
             description: t.storeDescs?.pe || "Aileniz için en iyisi.",
             price: "₺169",
             features: t.storeFeatures?.pe || ["Extra Özellikler", "Daha Hızlı AI", "Gizli Mod"],
             buttonText: "Abone Ol",
             buttonVariant: "secondary",
             onClick: () => {
               if(!currentUser) return setShowAuthModal(true);
               setPurchasingPkg({amount:0, tier:'premium-extra', name:t.storePremiumExtra, price:'₺169 / mo'});
             }
           },
           {
             planName: t.storeElite,
             description: t.storeDescs?.e || "Gerçek bir mistik üstad için.",
             price: "₺249",
             features: t.storeFeatures?.e || ["Elite Üyelik", "Özel Mistik Chat", "Sınırsız Oracle"],
             buttonText: "Mistik Ol",
             buttonVariant: "primary",
             onClick: () => {
               if(!currentUser) return setShowAuthModal(true);
               setPurchasingPkg({amount:0, tier:'elite', name:t.storeElite, price:'₺249 / mo'});
             }
           }
         ]}
       />
    </div>
  );
};
