export default function AboutUs() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <section className="bg-[#f5f5f5] dark:bg-gray-800 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Athlonix 🥇</h1>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-400 text-lg">
                Athlonix est une association sportive, qui vise à promouvoir tout type de sport et d'activités
                physiques. <br /> Notre mission est de créer un environnement inclusif et accueillant pour tous les
                passionnés de sport. <br /> <br />
                Nous organisons des événements sportifs, des compétitions et des cours de sport pour venir découvrir de
                nouvelles activités et rencontrer d'autres passionnés de sport. <br /> <br />
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://picsum.photos/500/500"
                style={{
                  aspectRatio: '500/500',
                  objectFit: 'cover',
                }}
                width="500"
                height="500"
                alt="Athlonix"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
            <div className="flex items-center justify-center">
              <img
                src="https://picsum.photos/500/500"
                style={{
                  aspectRatio: '500/500',
                  objectFit: 'cover',
                }}
                width="500"
                height="500"
                alt="Our Story"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Notre Histoire 📖</h2>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-400 text-lg">
                Notre association a été fondée en 2023 par un groupe de passionnés de sport qui voulaient partager leur
                amour du sport avec les autres. <br /> <br />
                Rassemblé autour de valeurs communes lors d'événements Esports et de compétitions de football, le groupe
                a décidé de créer Athlonix pour promouvoir ces valeurs, parce qu'ensemble nous sommes convaincus que le
                sport est un puissant vecteur de rassemblement.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f5f5f5] dark:bg-gray-800 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Nos activités sportives ⚽
              </h2>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-400 text-lg">
                Chez Athlonix, nous proposons une large gamme d'activités sportives pour répondre aux goûts et aux
                besoins de tous les jeunes, quel que soit leur niveau de compétence. De l'esport au football en passant
                par la natation, nous avons quelque chose pour tout le monde. <br /> <br />
                Les membres d'Athlonix partcipent aux choix des activités et des programmes sportifs, et nous
                travaillons tous ensemble pour créer un environnement sûr et inclusif pour tous les participants.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://picsum.photos/500/500"
                style={{
                  aspectRatio: '500/500',
                  objectFit: 'cover',
                }}
                width="500"
                height="500"
                alt="Sport Activities"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
