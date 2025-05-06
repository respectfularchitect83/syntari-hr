interface StatCardProps {
  title: string
  value: string
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center justify-center">
      <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
