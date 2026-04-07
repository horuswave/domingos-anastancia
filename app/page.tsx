export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbf7f1] font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-stone-900 overflow-hidden">
        {/* Elegant gradient background instead of image */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-black" />

        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto text-white">
          <div className="mb-6 text-sm tracking-[0.35em] uppercase opacity-75 font-light">
            Plataforma de Convites Digitais
          </div>

          <h1 className="text-6xl md:text-7xl font-light tracking-tighter leading-none mb-8">
            Convites que{" "}
            <span className="font-normal text-amber-300">encantam</span>
          </h1>

          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90 leading-relaxed mb-12">
            Crie convites digitais elegantes, gerencie confirmações em tempo
            real e ofereça uma experiência inesquecível aos seus convidados.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a
              href="/admin/login"
              className="inline-flex h-14 items-center justify-center px-12 rounded-full bg-white text-stone-900 font-medium text-lg hover:bg-amber-100 transition-all active:scale-[0.98]"
            >
              Entrar como Casal ou Administrador
            </a>

            <a
              href="/convite"
              className="inline-flex h-14 items-center justify-center px-12 rounded-full border border-white/60 text-white font-medium text-lg hover:bg-white/10 transition-all"
            >
              Ver convite de exemplo
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 text-xs tracking-widest">
          <span>Deslize para explorar</span>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/40 to-transparent mt-4" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-xs tracking-widest rounded-full mb-4">
              PARA CASAMENTOS E EVENTOS ESPECIAIS
            </div>
            <h2 className="text-4xl font-light tracking-tight text-stone-800">
              Simples. Elegante. Completo.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-5xl mb-6">💌</div>
              <h3 className="text-2xl font-light mb-4 text-stone-800">
                Convites Digitais
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Convites bonitos, totalmente personalizáveis com as cores,
                fontes e estilo do vosso evento. Acessíveis via link único.
              </p>
            </div>

            <div>
              <div className="text-5xl mb-6">📋</div>
              <h3 className="text-2xl font-light mb-4 text-stone-800">
                Gestão de Convidados
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Envie convites, acompanhe RSVPs em tempo real, gerencie
                acompanhantes, preferências alimentares e muito mais.
              </p>
            </div>

            <div>
              <div className="text-5xl mb-6">🎁</div>
              <h3 className="text-2xl font-light mb-4 text-stone-800">
                Lista de Presentes
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Crie lista de presentes físicos e contribuições monetárias com
                detalhes de IBAN, carteiras móveis e referências.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Couples Section */}
      <section className="py-24 px-6 bg-[#fbf7f1]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-light tracking-tight text-stone-800 mb-6">
            Para os noivos e organizadores
          </h2>
          <p className="text-lg text-stone-600 mb-10 max-w-lg mx-auto">
            Tenha controlo total do seu evento. Crie o convite, envie para os
            convidados, acompanhe confirmações e gerencie tudo de forma simples
            e elegante.
          </p>

          <a
            href="/admin/login"
            className="inline-flex h-14 items-center justify-center px-14 rounded-full bg-stone-800 hover:bg-black text-white font-medium text-lg transition-all"
          >
            Aceder ao Dashboard
          </a>
        </div>
      </section>

      {/* Example Invitation */}
      <section className="py-24 px-6 border-t border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="uppercase tracking-[0.125em] text-xs text-stone-500 mb-4">
            Experimente
          </p>
          <h2 className="text-4xl font-light mb-8 text-stone-800">
            Veja como fica o convite dos convidados
          </h2>

          <a
            href="/convite"
            className="inline-block px-12 py-4 border border-stone-300 rounded-full text-lg hover:bg-stone-50 hover:border-stone-400 transition-all"
          >
            Ver convite de exemplo →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white/70 py-20 px-6 text-center">
        <p className="text-xl font-light tracking-wide">Convites Digitais</p>
        <p className="mt-3 text-sm opacity-60 max-w-md mx-auto">
          Plataforma elegante para casamentos e eventos especiais em Moçambique
        </p>

        <div className="mt-16 text-xs opacity-50">
          © 2026 • Maputo, Moçambique
        </div>
      </footer>
    </div>
  );
}
