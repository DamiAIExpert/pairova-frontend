const Footer = () => {
  return (
    <div className="bg-[#00040E] py-10 px-5 md:px-[50px]">
      <div className="grid gris-cols-1 md:grid-cols-3 lg:grid-cols-4 container mx-auto">
        <div>
           <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px] bg-white px-3 py-2 rounded-md" />

          <div className="text-white my-5">
            <p className="text-sm">
              Boston street Number 10,
              <br /> Ston villa, Lagos
            </p>

            <p className="py-3 text-sm">Email: anjdhska@gmail.com</p>

            <p className="text-sm">Phone: +234-0183774832----</p>
          </div>
        </div>

        <div className="text-white">
          <h5 className="font-semibold pb-6">Company</h5>

          <button className="block my-2">Home</button>
          <button className="block my-2">Services</button>
          <button className="block my-2">Project</button>
          <button className="block my-2">About us</button>
        </div>

        <div className="text-white">
          <h5 className="font-semibold pb-6">Information</h5>

          <button className="block my-2">Careers</button>
          <button className="block my-2">Help Center</button>
          <button className="block my-2">Privacy Policy</button>
          <button className="block my-2">Term and Conditions</button>
        </div>

        <div className="text-white">
          <h5 className="font-semibold pb-6">Subscribe to our Newsletter</h5>

          <div className="flex items-center gap-3 border border-white py-2 px-3">
            <input
              type="text"
              className="focus:outline-none bg-transparent border-none text-white w-full"
              placeholder="Email Address"
            />
            <button className="bg-white px-7 py-1 rounded-md text-black">Send</button>
          </div>

          <div className="my-8 ">
            <h5 className="font-semibold pb-2 text-white">Sponsors</h5>

            <div>
              <img src="/Images/uba.AVIF" alt="uba" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
