type Props = {
    used: number;
    total: number;
  };
  
  export default function StorageBar({ used, total }: Props) {
    const percentage = (used / total) * 100;
  
    return (
      <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
        <div
          className="bg-blue-600 h-3 transition-all"
          style={{ width: `${percentage}%` }}
        />
        <p className="text-sm text-gray-600 mt-2">
          {used} MB of {total} MB used
        </p>
      </div>
    );
  }
  