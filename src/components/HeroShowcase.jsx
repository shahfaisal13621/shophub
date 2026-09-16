import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function HeroShowcase({ products }) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const items = products.slice(0, 5);

  useEffect(() => {
    if (items.length < 2 || shouldReduceMotion) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [items.length, shouldReduceMotion]);

  if (items.length === 0) return null;
  const current = items[index];

  return (
    <div className="hero-showcase">
      <div className="hero-showcase-glow" aria-hidden="true" />
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92, y: -12 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="hero-showcase-item"
        >
          <img src={current.thumbnail} alt={current.title} className="hero-showcase-image" />
          <p className="hero-showcase-title">{current.title}</p>
          <span className="hero-price-tag">${current.price.toFixed(2)}</span>
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="hero-showcase-dots" role="tablist" aria-label="Featured product">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${item.title}`}
              className={`hero-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}