"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-screen overflow-hidden px-[18px] pt-2 [margin-left:calc(50%-50vw)]">
      <div className="relative min-h-[600px] overflow-hidden bg-paper shadow-[0_18px_50px_rgba(40,24,18,0.08)]">
        <div className="relative z-10 mx-auto min-h-[600px] px-[18px] py-7">
          <div className="relative z-30 flex min-h-[540px] w-[min(50%,560px)] flex-col justify-center gap-8 max-[980px]:w-full max-[980px]:pb-[480px] max-[680px]:pb-[420px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-xs font-extrabold uppercase text-oxblood">
                Portfolio / 2026
              </div>
              <h1 className="mt-8 max-w-[9ch] font-serif text-8xl font-bold leading-[0.9] text-oxblood max-[680px]:text-6xl">
                Piyush Goel
              </h1>
              <div className="mt-3 text-4xl text-[#a33a3a] max-[680px]:text-3xl">
                Voice Artist
              </div>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted">
                Voice work, hosting, and creator-led storytelling with a clean,
                direct delivery. Built for radio, digital platforms, and branded work.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a className="rounded-full bg-oxblood px-5 py-3 font-bold text-[#fff8f4]" href="#work">
                  Previous Work
                </a>
                <a className="rounded-full border border-ink/10 px-5 py-3 font-bold" href="#contact">
                  Contact
                </a>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 max-[680px]:grid-cols-1">
              {[
                { label: "Radio", desc: "Hint Radio 90.4, Radio Nageen 107.8, Live FM 107.2" },
                { label: "Digital", desc: "Kuku FM, Pocket FM, Story TV, social-first content" },
                { label: "Freelance", desc: "Commercials, narration, corporate and voice projects" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-ink/10 bg-white/60 p-4">
                  <strong className="block mb-1">{item.label}</strong>
                  <span className="text-sm leading-5 text-muted">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden max-[980px]:top-auto max-[980px]:h-[760px] max-[680px]:h-[620px]">
            <span className="absolute bottom-[-360px] right-[65px] z-10 h-[760px] w-[760px] rounded-full bg-oxblood max-[980px]:bottom-[-270px] max-[980px]:right-[-70px] max-[980px]:h-[620px] max-[980px]:w-[620px] max-[680px]:bottom-[-190px] max-[680px]:right-[-125px] max-[680px]:h-[470px] max-[680px]:w-[470px]" />
            <span className="absolute bottom-[-540px] right-[-145px] z-10 h-[1180px] w-[1180px] rounded-full border-2 border-oxblood/25 max-[980px]:bottom-[-380px] max-[980px]:right-[-220px] max-[980px]:h-[920px] max-[980px]:w-[920px] max-[680px]:bottom-[-285px] max-[680px]:right-[-250px] max-[680px]:h-[720px] max-[680px]:w-[720px]" />
            <span className="absolute bottom-[-470px] right-[-75px] z-10 h-[1040px] w-[1040px] rounded-full border-2 border-oxblood/45 max-[980px]:bottom-[-315px] max-[980px]:right-[-155px] max-[980px]:h-[790px] max-[980px]:w-[790px] max-[680px]:bottom-[-230px] max-[680px]:right-[-195px] max-[680px]:h-[610px] max-[680px]:w-[610px]" />
            <span className="absolute bottom-[-400px] right-[-5px] z-10 h-[900px] w-[900px] rounded-full border-2 border-oxblood/75 max-[980px]:bottom-[-250px] max-[980px]:right-[-90px] max-[980px]:h-[660px] max-[980px]:w-[660px] max-[680px]:bottom-[-175px] max-[680px]:right-[-140px] max-[680px]:h-[500px] max-[680px]:w-[500px]" />
            <Image
              src="/testuserimage.png"
              alt="Piyush Goel portrait"
              fill
              className="object-contain object-right-bottom z-20 max-[980px]:object-right-bottom max-[680px]:object-right-bottom"
              style={{ objectPosition: "right 28px bottom 0" }}
              sizes="(max-width: 680px) 540px, (max-width: 980px) 650px, 760px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
