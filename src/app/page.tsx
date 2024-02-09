export default function Home() {
  return (
    <div className="pt-16">
      <section className="relative">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl dark:text-white font-extrabold mx-auto md:text-5xl lg:text-8xl text-black">
              Welcome to WeGo
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700 dark:text-gray-400">
              Explore effortlessly with Wego, your AI travel buddy, making every
              trip a breeze on our progressive web app.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
          style={{
            background:
              'linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)',
          }}
        ></div>
      </section>
    </div>
  );
}
