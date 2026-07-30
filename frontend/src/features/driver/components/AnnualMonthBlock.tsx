export interface AnnualRouteGroup {
  route: string;
  count: number;
  income: string;
}

export interface AnnualMonthGroup {
  month: string;
  total: string;
  routes: AnnualRouteGroup[];
}

export function AnnualMonthBlock({ month, total, routes }: AnnualMonthGroup) {
  return (
    <div className="border-b border-[#353535] last:border-0">
      <div className="flex items-center justify-between px-2 py-5">
        <h3 className="text-xl font-bold text-white">{month}</h3>
        <span className="text-lg font-semibold text-white">{total}</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-[14px] font-medium text-[#8F8F8F]">
            <th className="pb-2 pl-2 pr-4 font-medium">Ruta</th>
            <th className="pb-2 pr-4 text-center font-medium">Viajes</th>
            <th className="pb-2 pr-2 text-right font-medium">Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r, i) => (
            <tr key={i} className="border-t border-[#2a2a2a]">
              <td className="py-3 pl-2 pr-4 text-[16px] font-medium text-white">{r.route}</td>
              <td className="py-3 pr-4 text-center text-[16px] text-white">{r.count}</td>
              <td className="py-3 pr-2 text-right text-[16px] font-semibold text-white">{r.income}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
