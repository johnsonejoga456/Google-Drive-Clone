import { FileType } from '@/types/file';
import { Download, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  file: FileType;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
};

export default function FileCard({ file, onDelete, onRename }: Props) {
  return (
    <div className="border rounded-lg p-3 shadow-md hover:shadow-lg transition">
      <h3 className="font-medium text-lg mb-2">{file.name}</h3>
      <div className="flex justify-between items-center">
        <Button onClick={() => onRename(file.$id)} variant="ghost">
          <Pencil className="w-5 h-5" />
        </Button>
        <a href={file.url} download>
          <Button variant="ghost">
            <Download className="w-5 h-5" />
          </Button>
        </a>
        <Button onClick={() => onDelete(file.$id)} variant="destructive">
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
