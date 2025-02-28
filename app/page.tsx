import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <FileUpload />
      <FileList />
    </div>
  );
}
