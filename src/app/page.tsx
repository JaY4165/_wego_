export default function Home() {
  return (
    <div className="pt-16">
      <section className="relative">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl dark:text-white font-extrabold mx-auto md:text-5xl lg:text-8xl text-black">
              Welcome to WeGo
            </h2>
            <p className="max-w-2xl mx-auto text-black dark:text-white">
              Explore effortlessly with Wego, your AI travel buddy, making every
              trip a breeze on our progressive web app.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg main-gradient"
          // style={{
          //   background:
          //     'linear-gradient(106.89deg, rgba(244, 196, 48,1) 30%,rgba(80, 200, 120,1) 43%, rgb(75, 0, 130,1) 115.91%)',
          // }}
        ></div>
      </section>
    </div>
  );
}
