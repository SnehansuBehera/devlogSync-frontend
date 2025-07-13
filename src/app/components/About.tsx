export default function About() {
  const features = [
    {
      icon: "📅",
      title: "Free transfers",
      description:
        "Create scheduled experiences and automated repeat payments by scheduling internal transfers.",
    },
    {
      icon: "🏛️",
      title: "Multiple accounts",
      description:
        "Run your operations with cash from your account and projected profits better based on your accounts.",
    },
    {
      icon: "🛡️",
      title: "Unmatched security",
      description:
        "Remotely manage user finances with compliance-grade MFA, user tracking, and account-level access.",
    },
  ];

  return (
    <section
      id="about"
      className="py-16 px-6 md:px-12 bg-zinc-100 text-gray-800"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-10 mb-10 sm:mb-14">
          <div>
            <p className="text-sm text-blue-500 uppercase font-semibold">
              Future forward
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">
              Experience that grows with your scale.
            </h2>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto ">
            Design a financial operations system that works for your business
            and streamlined cash flow management
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-left ring-1 ring-zinc-200 px-3 py-6 rounded-2xl shadow-md shadow-gray-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
