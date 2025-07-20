export default function StepsSection() {
  const steps = [
    {
      number: "1",
      title: "Connect your tools",
      description:
        "Link GitHub and VS Code — all from a single dashboard with secure authentication.",
    },
    {
      number: "2",
      title: "Start coding as usual",
      description:
        "DevLogSync runs in the background, tracking activity, commits, and task updates in real-time",
    },
    {
      number: "3",
      title: "Get daily summaries instantly",
      description:
        "AI-powered logs are generated automatically, organized per project, and ready to share or export.",
    },
  ];

  return (
    <section id="guide" className="bg-[#002b40] text-white py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-blue-300 uppercase font-medium mb-2">Step</p>
        <h1 className="text-lg md:text-4xl font-semibold mb-6 sm:mb-12 leading-tight">
          Kickstart your productivity <br /> with automated developer logs.
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
