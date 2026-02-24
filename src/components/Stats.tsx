const stats = [
  { value: '40%', label: 'less time on admin tasks' },
  { value: '3×', label: 'faster team onboarding' },
  { value: '94%', label: 'manager satisfaction score' },
  { value: '2 weeks', label: 'average time to first insight' },
]

export function Stats() {
  return (
    <section className="py-16 px-6 bg-primary">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
            <p className="text-primary-light text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
