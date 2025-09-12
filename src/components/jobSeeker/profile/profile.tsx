import { Icon } from "@iconify/react";

const Profile = () => {
  return (
    <div>
      <div className="min-h-screen bg-white mx-3 px-5 md:px-[50px] pb-10">
        <div>
          <img
            src="/Images/profile-bg.AVIF"
            alt="profile-showcase"
            className="w-full"
          />
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between  mt-[-40px]">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <img
              src="/Images/profile.AVIF"
              alt="profile"
              className="w-[200px] h-[200px] rounded-[50%] border-4 border-white"
            />

            <div>
              <h3 className="text-2xl font-semibold">Arya Gbolade</h3>
              <p className="text-sm text-[#989898] py-1 pb-5">
                I’m a Charity Administrator based in Nigeria
              </p>
              <span className="text-sm py-5">
                Verified •{" "}
                <span className="text-[#338FFD]">Applied to over 30 Jobs</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 my-5 xl:my-0">
            <button className="flex items-center gap-3 border border-black/30 shadow-xl px-5 py-2 rounded-md cursor-pointer">
              <Icon icon="tabler:video" className="text-2xl" />
              Video call
            </button>

            <button className="flex items-center gap-3 bg-[#161616] text-white px-5 py-2 rounded-md cursor-pointer">
              <Icon icon="lucide:message-square-text" className="text-2xl" />
              Video call
            </button>
          </div>
        </div>

        {/* Bio */}

        <div className="mt-[50px] my-5 py-5 border-b border-black/30">
          <h3 className="text-xl font-semibold">Bio</h3>

          <p className="text-sm text-[#989898] py-5">
            {" "}
            I was responsible for overseeing daily operations, ensuring
            compliance with legal and
            <br /> financial regulations, and supporting fundraising activities.{" "}
          </p>
        </div>

        {/* About */}

        <div>
          <div className="my-10 py-5 border-b border-black/30">
            <h3 className="text-xl font-semibold">About Me</h3>

            <div className="flex flex-col lg:flex-row my-5 gap-[70px]">
              <div className="lg:w-[60%]">
                <p className="text-sm text-[#989898]">
                  Ayre Gbolade is a dynamic and results-driven Administrator
                  with over a decade of experience in leading high-performing
                  teams across diverse industries. Known for his ability to
                  foster collaboration, drive productivity, and inspire team
                  members to achieve their full potential, Jonathan excels in
                  creating a positive and inclusive work environment.
                </p>

                <p className="text-sm text-[#989898] pt-3">
                  With a strong background in project management, strategic
                  planning, and employee development, Jonathan has a proven
                  track record of delivering exceptional results while
                  maintaining a focus on team morale and professional growth.
                </p>
              </div>

              <div className="lg:w-[40%] grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h6 className="text-[#757575]">Location</h6>
                  <p className="my-2 flex items-center gap-2">
                    <Icon
                      icon="twemoji:flag-nigeria"
                      className="text-2xl w-[20px] h-[20px] rounded-[50%]"
                    />
                    Lagos, Nigeria
                  </p>
                </div>

                <div>
                  <h5 className="text-[#757575]">Gender</h5>
                  <p className="my-2">Female</p>
                </div>

                <div>
                  <h6 className="text-[#757575]">Portfolio</h6>
                  <p className="my-2">@ayrabehance.net</p>
                </div>

                <div>
                  <h6 className="text-[#757575]">Email</h6>
                  <p className="my-2">ayragbolade@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-xl font-semibold">Experience</h3>

          <div className="flex items-start gap-5 my-8 border-b border-black/30">
            <img src="/Images/company-logo.AVIF" alt="company" className="w-[60px]" />

            <div>
              <div>
                <div className="text-sm flex items-center gap-1 text-[#FFB3A6]">
                  <span className="text-2xl">•</span>
                  <h5>Company</h5>
                </div>
                <h4 className="text-2xl font-semibold py-2">Project Manager</h4>
                <p className="text-sm text-[#808080]">
                  Quantum SHAD - Full Time
                </p>
                <p className="text-sm text-[#1B66BA] py-2">
                  September 2010 - August 2018
                </p>
                <p className="text-sm text-[#1B66BA]">Lagos, Nigeria</p>
              </div>

              <div className="my-10">
                <ol className="list-disc text-sm text-[#FFB3A6]">
                  <li>Role</li>
                </ol>

                <ol className="list-disc text-[#767676]">
                  <li>
                    Maintain accurate records, databases, and documentation for
                    the charity
                  </li>

                  <li>
                    Assist in planning and coordinating fundraising campaigns
                    and charity events.
                  </li>

                  <li>
                    Work with finance teams to manage payroll and supplier
                    payments.
                  </li>

                  <li>
                    Liaise with board members, trustees, and external partners
                  </li>

                  <li>
                    Ensure compliance with charity laws, regulations, and data
                    protection policies.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-5 my-8 border-b border-black/30">
            <img src="/Images/company-logo.AVIF" alt="company" className="w-[60px]" />

            <div>
              <div>
                <div className="text-sm flex items-center gap-1 text-[#FFB3A6]">
                  <span className="text-2xl">•</span>
                  <h5>Company</h5>
                </div>
                <h4 className="text-2xl font-semibold py-2">Project Manager</h4>
                <p className="text-sm text-[#808080]">
                  Quantum SHAD - Full Time
                </p>
                <p className="text-sm text-[#1B66BA] py-2">
                  September 2010 - August 2018
                </p>
                <p className="text-sm text-[#1B66BA]">Lagos, Nigeria</p>
              </div>

              <div className="my-10">
                <ol className="list-disc text-sm text-[#FFB3A6]">
                  <li>Role</li>
                </ol>

                <ol className="list-disc text-[#767676]">
                  <li>
                    Maintain accurate records, databases, and documentation for
                    the charity
                  </li>

                  <li>
                    Assist in planning and coordinating fundraising campaigns
                    and charity events.
                  </li>

                  <li>
                    Work with finance teams to manage payroll and supplier
                    payments.
                  </li>

                  <li>
                    Liaise with board members, trustees, and external partners
                  </li>

                  <li>
                    Ensure compliance with charity laws, regulations, and data
                    protection policies.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Educaation */}

        <div className=" ">
          <h3 className="text-xl font-semibold">Education</h3>

          <div className="flex flex-col lg:flex-row justify-between my-8 border-b border-black/30 pb-10">
            <div className="flex items-start md:-center gap-5 my-5 lg:my-0">
              <img src="/Images/oau.AVIF" alt="oau" className="w-[60px] md:w-auto" />

              <div>
                <div>
                  <div className="text-sm flex items-center gap-1 text-[#FFB3A6]">
                    <span className="text-2xl">•</span>
                    <h5>School</h5>
                  </div>
                  <h4 className="md:text-2xl font-semibold py-0">
                    Obafemi Awolowo University
                  </h4>
                  <p className="text-sm text-[#808080]">
                    Bachelor’s Degree • Administration
                  </p>
                  <p className="text-sm text-[#1B66BA] py-2">
                    First Class Honours
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start md:items-center gap-5 my-5 lg:my-0">
              <img src="/Images/oau.AVIF" alt="oau" className="w-[60px] md:w-auto" />

              <div>
                <div>
                  <div className="text-sm flex items-center gap-1 text-[#FFB3A6]">
                    <span className="text-2xl">•</span>
                    <h5>School</h5>
                  </div>
                  <h4 className="md:text-2xl font-semibold py-0">
                    Obafemi Awolowo University
                  </h4>
                  <p className="text-sm text-[#808080]">
                    Bachelor’s Degree • Administration
                  </p>
                  <p className="text-sm text-[#1B66BA] py-2">
                    First Class Honours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificattion */}
        <div>
          <h3 className="text-xl font-semibold">Certification</h3>

          <div className="flex flex-col lg:flex-row justify-between my-8 pb-10 border-b border-black/30 gap-10">
            <div className="border border-black/30 rounded-md px-5 py-5">
              <div className="flex items-start gap-3">
                <img src="/Images/google.svg" alt="google" className="w-[60px] md:w-auto" />

                <div>
                  <h3 className="md:text-xl font-semibolf">
                    Professional Business Administrator
                  </h3>
                  <p className="text-sm text-[#808080]">Google.com</p>
                  <span className="text-sm text-[#1B66BA]">
                    Issued May 2002
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="font-semibold text-[#828282]">Verified</p>
                <button className="flex items-center gap-3 border-2 border-black/30 cursor-pointer text-[#808080] bg-[#F0F0F0] rounded-[999px] py-1 px-3 text-sm">
                  Show Credential{" "}
                  <Icon icon="ph:arrow-square-out-bold" className="text-2xl" />
                </button>
              </div>
            </div>

            <div className="border border-black/30 rounded-md px-5 py-5">
              <div className="flex items-start gap-3">
                <img src="/Images/google.svg" alt="google" className="w-[60px] md:w-auto" />

                <div>
                  <h3 className="md:text-xl font-semibolf">
                    Professional Business Administrator
                  </h3>
                  <p className="text-sm text-[#808080]">Google.com</p>
                  <span className="text-sm text-[#1B66BA]">
                    Issued May 2002
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="font-semibold text-[#828282]">Verified</p>
                <button className="flex items-center gap-3 border-2 border-black/30 cursor-pointer text-[#808080] bg-[#F0F0F0] rounded-[999px] py-1 px-3 text-sm">
                  Show Credential{" "}
                  <Icon icon="ph:arrow-square-out-bold" className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}

        <div>
          <h3 className="text-xl font-semibold">Skills</h3>

          <div className="flex flex-col md:flex-row gap-[100px] lg:gap-[150px] my-6 pb-10 border-b border-black/30">
            <div>
              <ol className="list-disc text-sm text-[#FFB3A6] px-5">
                <li>Hard and Soft Skills</li>
              </ol>

              <ol className="list-disc text-[#767676] px-5">
                <li>Fundraising & Grant Writing</li>

                <li>Communication & Public Speaking</li>

                <li>Problem-Solving</li>

                <li>Compliance & Legal Knowledge</li>
              </ol>
            </div>

            <div>
              <ol className="list-disc text-sm text-[#FFB3A6] px-5">
                <li>Technical Skills</li>
              </ol>

              <ol className="list-disc text-[#767676] px-5">
                <li>CRM Software</li>

                <li>Microsoft Ofiice</li>

                <li>Email Marketing Tools</li>

                <li>Accounting Software</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Attachment */}

        <div className="border-b border-black/30">
          <h3 className="text-xl font-semibold">Attachment</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-6 pb-10 gap-10">
            <div className="py-2 px-2 border border-black/30 rounded-md flex items-center gap-4">
              <Icon icon="lucide:file-text" className="text-2xl" />
              <span className="text-[#1B66BA]">Document.pdf</span>
            </div>

             <div className="py-2 px-2 border border-black/30 rounded-md flex items-center gap-4">
              <Icon icon="lucide:file-text" className="text-2xl" />
              <span className="text-[#1B66BA]">Document.pdf</span>
            </div>

             <div className="py-2 px-2 border border-black/30 rounded-md flex items-center gap-4">
              <Icon icon="lucide:file-text" className="text-2xl" />
              <span className="text-[#1B66BA]">Document.pdf</span>
            </div>

             <div className="py-2 px-2 border border-black/30 rounded-md flex items-center gap-4">
              <Icon icon="lucide:file-text" className="text-2xl" />
              <span className="text-[#1B66BA]">Document.pdf</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
