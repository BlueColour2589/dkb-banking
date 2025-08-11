
import DashboardActions from "@/components/DashboardActions";

export default function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Joint Account</h1>
        <p className="text-gray-500">Max Mustermann & Anna Müller</p>
      </div>
      <DashboardActions />
    </div>
  );
}
