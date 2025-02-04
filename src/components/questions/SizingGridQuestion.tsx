import React, { useState } from "react";

export default function SizingGrid({ totalItems = 1000 }) {
  const categories = ["Men", "Women", "Boys", "Girls"];
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  const [distribution, setDistribution] = useState(
    categories.reduce((acc, category) => {
      acc[category] = { percentage: 0, sizes: sizeOptions.reduce((sAcc, size) => ({ ...sAcc, [size]: 0 }), {}) };
      return acc;
    }, {})
  );

  const handlePercentageChange = (category, value) => {
    const newDistribution = { ...distribution };
    newDistribution[category].percentage = parseFloat(value);
    setDistribution(newDistribution);
  };

  const handleSizeChange = (category, size, value) => {
    const newDistribution = { ...distribution };
    newDistribution[category].sizes[size] = parseInt(value);
    setDistribution(newDistribution);
  };

  const validateTotalPercentage = () => {
    const totalPercentage = categories.reduce((sum, category) => sum + distribution[category].percentage, 0);
    return totalPercentage === 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Sizing Distribution</h2>
      <p className="mb-4">Total Items to Distribute: {totalItems}</p>
      <form>
        {categories.map((category) => (
          <div key={category} className="mb-6 p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{category}</h3>
            <label className="block mb-2">
              Percentage of Total ({distribution[category].percentage}%):
              <input
                type="number"
                min="0"
                max="100"
                value={distribution[category].percentage}
                onChange={(e) => handlePercentageChange(category, e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              />
            </label>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {sizeOptions.map((size) => (
                <div key={size}>
                  <label className="block text-sm font-medium">
                    {size}:
                    <input
                      type="number"
                      min="0"
                      value={distribution[category].sizes[size]}
                      onChange={(e) => handleSizeChange(category, size, e.target.value)}
                      className="mt-1 block w-full p-2 border rounded"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!validateTotalPercentage() && (
          <p className="text-red-500 font-semibold">Total percentage must equal 100%.</p>
        )}
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!validateTotalPercentage()}
        >
          Save Sizing Data
        </button>
      </form>
    </div>
  );
}
