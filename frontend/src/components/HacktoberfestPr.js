import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid"; // Correct import for solid icon
import { useState } from "react";

const HacktoberfestPr = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0 is January, 9 is October

  // Years to display in the dropdown
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  // To store the selected year
  const [selectedYear, setSelectedYear] = useState(null);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  return (
    <div className="relative">
      {/* Dropdown container positioned at top right */}
      <div className="absolute top-0 right-0">
        <Menu>
          <MenuButton className="inline-flex items-center gap-2 rounded-md bg-white-800 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/20 focus:outline-none hover:bg-gray-700">
            {selectedYear ? `Year: ${selectedYear}` : "Select Year"}
            <ChevronDownIcon className="size-4 fill-white/60" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm text-white shadow-lg transition duration-100 ease-out">
            {years.map((year) => (
              <MenuItem key={year}>
                <button
                  onClick={() => handleYearSelect(year)}
                  disabled={year === currentYear && currentMonth < 9} // Disable current year if month is before October
                  className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 focus:bg-white/10 ${
                    year === currentYear && currentMonth < 9 ? "text-gray-500" : "text-white"
                  }`}
                >
                  {year}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default HacktoberfestPr;
