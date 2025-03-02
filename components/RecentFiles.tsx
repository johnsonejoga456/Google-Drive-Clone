import { useFileContext } from '@/context/FileContext';
import FileCard from '@/components/FileCard';

export default function RecentFiles() {
  const { files } = useFileContext();

  const recentFiles = files.slice(0, 6); // Show only the 6 most recent files

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recentFiles.map((file) => (
          <FileCard
            key={file.$id}
            file={file}
            onDelete={() => console.log('Delete')}
            onRename={() => console.log('Rename')}
          />
        ))}
      </div>
    </div>
  );
}
