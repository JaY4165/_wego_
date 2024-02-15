import { headers } from 'next/headers';

export default async function NotFound() {
  const headersList = headers();
  const domain = headersList.get('host');
  return (
    <div className="pt-16">
      <section className="relative">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
            <h1 className="text-6xl dark:text-white font-extrabold mx-auto md:text-5xl lg:text-9xl text-black">
              404
            </h1>
            <h3 className="max-w-2xl text-xl mx-auto text-black dark:text-white">
              Page Not Found
            </h3>
          </div>
        </div>
        <div
          className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
          // style={{
          //   background:
          //     'linear-gradient(106.89deg, rgba(244, 196, 48,1) 30%,rgba(80, 200, 120,1) 43%, rgb(75, 0, 130,1) 115.91%)',
          // }}
        ></div>
      </section>
    </div>
  );
}
