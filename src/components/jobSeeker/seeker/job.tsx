import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";

const Job = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className=" ">
        <div className="flex items-center gap-4 border-b border-black/30 px-5 py-5">
          <Icon
            icon="ph:caret-circle-left-light"
            className="text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>

        <div className="bg-white mx-5 my-2 px-10 py-10 rounded-md">
          <h1 className="text-3xl font-semibold">Charity Administrator</h1>

          <div className="flex flex-col lg:flex-row justify-between my-8 gap-5 lg:gap-0">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                L
              </h4>

              <div className="">
                <div className="flex gap-3">
                  <p>Fey</p>
                  <span>•</span>
                  <div className="flex items-center">
                    <Icon icon="tdesign:location" className="text-lg" />
                    <p>Abuja, Nigeria</p>
                  </div>
                  <span>•</span>
                  <p>Onsite</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 my-2">
                  <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">
                    Full Time
                  </p>
                  <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">
                    Hybrid
                  </p>
                  <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">
                    1 - 3 years
                  </p>
                </div>

                <div>
                  <p>Volunteer • 100 Applicants</p>
                </div>
              </div>
            </div>

            <div>
              <button className="bg-black text-white py-2 px-7 rounded-md cursor-pointer">
                Apply button
              </button>
            </div>
          </div>

          {/* About Role */}

          <div className="my-10">
            <h2 className="text-xl font-[500] text-[#4F4F4F]">
              About this role
            </h2>

            <p className="text-[#767676] my-3 text-sm leading-6">
              A Charity Administrator plays a crucial role in the smooth
              operation of a nonprofit organization. This role involves handling
              administrative tasks, managing records, coordinating fundraising
              efforts, and ensuring compliance with charity regulationExperience
              in office administration, fundraising, or volunteer coordination
              is a plus. This role is perfect for someone passionate about
              making a difference while ensuring the charity runs efficiently.
            </p>
          </div>

          {/* Qualifications */}

          <div>
            <h2 className="text-xl font-[500] text-[#4F4F4F]">
              Qualifications
            </h2>

            <div className="my-3">
              <ol className="list-disc px-4">
                <li className="text-[#767676]">
                  At least 1–3 years of experience in administration, office
                  management, or charity work.
                </li>
                <li className="text-[#767676]">
                  A degree or diploma in Business Administration, Nonprofit
                  Management, Social Work, or a related field
                </li>
                <li className="text-[#767676]">
                  Strong ability to manage records, schedules, and documents
                  efficiently
                </li>
                <li className="text-[#767676]">
                  Excellent written and verbal communication skills for liaising
                  with donors, volunteers, and stakeholders.
                </li>
              </ol>
            </div>
          </div>

          {/* Responsibilities */}

          <div className="my-10">
            <h2 className="text-xl font-[500] text-[#4F4F4F]">
              Responsibilities
            </h2>

            <div className="my-3">
              <ol className="list-disc px-4">
                <li className="text-[#767676]">
                  Maintain accurate records, databases, and documentation for
                  the charity
                </li>
                <li className="text-[#767676]">
                  Assist in planning and coordinating fundraising campaigns and
                  charity events.
                </li>
                <li className="text-[#767676]">
                  Work with finance teams to manage payroll and supplier
                  payments.
                </li>
                <li className="text-[#767676]">
                  Liaise with board members, trustees, and external partners
                </li>
                <li className="text-[#767676]">
                  Ensure compliance with charity laws, regulations, and data
                  protection policies.
                </li>
              </ol>
            </div>
          </div>

          {/* Overview */}

          <div>
            <h2 className="text-xl font-[500] text-[#4F4F4F] ">
              Company Overview
            </h2>

            <div className="border lg:w-[700px] px-6 py-10 my-5">
              <div className="flex flex-col lg:flex-row justify-between gap-10">
                <div className="w-full">
                  <div className="flex items-center justify-between my-2">
                    <h4 className="font-[500] text-[#4F4F4F] ">Size</h4>
                    <p className="text-[#4F4F4F] ">1000 - 5000 employees</p>
                  </div>

                  <div className="flex items-center justify-between my-2">
                    <h4 className="font-[500] text-[#4F4F4F] ">Type</h4>
                    <p className="text-[#4F4F4F] ">Company - Public</p>
                  </div>

                  <div className="flex items-center justify-between my-2">
                    <h4 className="font-[500] text-[#4F4F4F] ">Sector</h4>
                    <p className="text-[#4F4F4F] ">Financial Services</p>
                  </div>
                </div>

                <div className="lg:px-5 lg:border-l w-full border-t py-5 lg:border-t-0 lg:py-0">
                  <div className="flex items-center justify-between my-2">
                    <h4 className="font-[500] text-[#4F4F4F] ">Founded</h4>
                    <p className="text-[#4F4F4F] ">1999</p>
                  </div>

                  <div className="flex items-center justify-between my-2">
                    <h4 className="font-[500] text-[#4F4F4F] ">Industry</h4>
                    <p className="text-[#4F4F4F] ">Financial Processing</p>
                  </div>

                  <div className="flex items-center justify-between my-2">
                    <h4 className="font-[500] text-[#4F4F4F] ">Location</h4>
                    <p className="text-[#4F4F4F] ">South Africa</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 py-10 border-t">
                <h5 className="text-[#4F4F4F] text-xl">Mission Statement</h5>

                <p className="text-[#4F4F4F] py-2 text-sm leading-6">
                  At Fey, our mission is to empower communities and drive
                  positive change by ensuring the efficient and transparent
                  operation of charitable initiatives. Through dedicated
                  administration, strategic fundraising, and strong governance,
                  we strive to maximize the impact of our programs and support
                  those in need. We are committed to fostering a culture of
                  compassion, integrity, and innovation, ensuring that every
                  resource is effectively managed to serve our beneficiaries.{" "}
                </p>
              </div>
            </div>
          </div>

          {/* Required Skills */}

          <div className="my-10">
            <h2 className="text-xl font-[500] text-[#4F4F4F]">
              Required Skills
            </h2>

            <div className="my-6">
              <ol className="list-disc text-sm px-4 text-[#FFB3A6]">
                <li>Hard and Soft Skills</li>
              </ol>

              <ol className="list-disc text-[#868686] px-4">
                <li>Fundraising & Grant Writing</li>
                <li>Communication & Public Speaking</li>
                <li>Problem-Solving</li>
                <li>Compliance & Legal Knowledge</li>
                <li>
                  Strong ability to manage records, schedules, and documents
                  efficiently
                </li>
              </ol>

              <ol className="list-disc text-sm px-4 text-[#FFB3A6] mt-6">
                <li>Hard and Soft Skills</li>
              </ol>

              <ol className="list-disc text-[#868686] px-4">
                <li>Microsoft Office</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job;
