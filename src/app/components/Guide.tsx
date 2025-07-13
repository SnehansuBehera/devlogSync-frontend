export default function StepsSection() {
  const steps = [
    {
      number: "1",
      title: "Open your account",
      description:
        "Sign up for easy and set up your account from the dashboard.",
    },
    {
      number: "2",
      title: "Transfer your money",
      description:
        "Move money from another account into it and start to earn it up.",
    },
    {
      number: "3",
      title: "Watch your balance grow",
      description:
        "Accessed instantly and remain insulated from market volatility.",
    },
  ];

  return (
    <section id="guide" className="bg-[#002b40] text-white py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-blue-300 uppercase font-medium mb-2">Step</p>
        <h1 className="text-2xl md:text-4xl font-semibold mb-10 sm:mb-12 leading-tight">
          Maximize your returns with a<br /> Reserve account that generates.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#003b5c] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-5xl font-bold text-blue-200  mb-3">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
