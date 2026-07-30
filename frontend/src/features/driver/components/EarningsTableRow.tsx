export interface EarningsRow {
  date: string;
  time: string;
  passenger: string;
  route: string;
  income: string;
}

export function EarningsTableRow({ date, time, passenger, route, income }: EarningsRow) {
  return (
    <tr className="border-b border-[#353535] last:border-0">
      <td className="py-4 pr-4">
        <span className="font-semibold text-white">{date}</span>
        {time && (
          <>
            <br />
            <span className="text-[15px] text-[#8F8F8F]">{time}</span>
          </>
        )}
      </td>
      <td className="py-4 pr-4 text-[18px] font-medium text-white">{passenger}</td>
      <td className="py-4 pr-4 text-[18px] font-medium text-white">{route}</td>
      <td className="py-4 text-right text-[18px] font-semibold text-white">{income}</td>
    </tr>
  );
}
