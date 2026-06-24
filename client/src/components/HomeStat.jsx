import { useEffect, useRef, useState } from "react";

export default function HomeStat() {
  const data = [
    {
      label: "Utilisateurs actifs",
      value: "100",
      suffix: "+",
      color: "from-violet-600 to-violet-400",
    },
    {
      label: "Livres catalogués",
      value: "500",
      suffix: "+",
      color: "from-violet-600 to-violet-400",
    },
    {
      label: "Taux de satisfaction",
      value: "98",
      suffix: "%",
      color: "from-violet-500 to-violet-300",
    },
  ];

  function CountUp({ target, suffix = "", duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasRun = useRef(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            const start = 0;
            const end = parseInt(target);
            const stepTime = Math.max(Math.floor(duration / end), 16);
            let current = start;
            const timer = setInterval(() => {
              current += Math.ceil(end / (duration / stepTime));
              if (current >= end) {
                current = end;
                clearInterval(timer);
              }
              setCount(current);
            }, stepTime);
          }
        },
        { threshold: 0.3 },
      );

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, [target, duration]);

    return (
      <span ref={ref}>
        {count}
        {suffix}
      </span>
    );
  }

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">
            BuchVault en chiffres
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-3">
            Une communauté qui grandit
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Chaque jour, de nouveaux étudiants rejoignent BuchVault pour accéder
            à une bibliothèque numérique moderne, fluide et sans contrainte.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {data.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-8 rounded transition-all duration-200"
            >
              <p
                className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 tabular-nums`}
              >
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  duration={1800}
                />
              </p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
