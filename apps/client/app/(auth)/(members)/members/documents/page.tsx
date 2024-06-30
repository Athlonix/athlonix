'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@repo/ui/components/ui/breadcrumb';
import { Card } from '@ui/components/ui/card';
import { CircleArrowLeft, File, FileImage, FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Files, type Folders, getAllFiles } from './utils';

function getParentFolders(folders: Folders[], folderId: number): Folders[] {
  const folder = folders.find((f) => f.id === folderId);
  if (!folder) {
    return [];
  }
  if (!folder.parent) {
    return [folder];
  }
  return [...getParentFolders(folders, folder.parent), folder];
}

function fileTypes(input: string) {
  switch (input) {
    case 'application/pdf' || 'application/x-pdf':
      return 'PDF';
    case 'application/msword' || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'Word';
    case input.includes('image') && input:
      return 'Image';
    default:
      return 'Other';
  }
}

function FolderItem({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <Card
      className="m-2 p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 folder-card w-48 h-24 rounded-lg shadow-md border-2 border-blue-200 dark:border-blue-400"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <FolderOpen className="w-8 text-blue-400" />
      </div>
      <h2>{name}</h2>
    </Card>
  );
}

function DisplayFolderAndFiles({
  folder,
  onFolderClick,
  files,
  onFileClick,
  currrentPath,
}: {
  folder: Folders[] | null;
  onFolderClick: (name: string) => void;
  files: Files[] | null;
  onFileClick: (id: number) => void;
  currrentPath: number | null;
}) {
  return (
    <>
      {currrentPath === null
        ? folder
            ?.filter((f) => !f.parent)
            .map((f) => <FolderItem key={f.id} name={f.name} onClick={() => onFolderClick(f.name)} />)
        : folder
            ?.filter((f) => f.parent === currrentPath)
            .map((f) => <FolderItem key={f.id} name={f.name} onClick={() => onFolderClick(f.name)} />)}

      {files
        ?.filter((f) => f.folder === currrentPath)
        .map((f) => (
          <Card
            key={f.id}
            className={
              'w-64 m-2 p-4 cursor-pointer transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700'
            }
            onClick={() => onFileClick?.(f.id)}
          >
            <div className="flex items-center space-x-2 mb-2">
              {fileTypes(f.type) === 'Image' ? <FileImage /> : <File />}
            </div>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold pr-4">{f.name}</h2>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {f.description.length > 25 ? `${f.description.slice(0, 25)}...` : f.description}
            </p>
            <p className="text-sm text-gray-500 mt-2">{fileTypes(f.type)}</p>
            <p className="text-xs text-gray-400 mt-2">
              {`${new Date(f.created_at).toLocaleDateString()} ${new Date(f.created_at).toLocaleTimeString()}`}
            </p>
          </Card>
        ))}
    </>
  );
}

export default function Documents() {
  const [files, setFiles] = useState<Files[] | null>(null);
  const [folders, setFolders] = useState<Folders[] | null>(null);
  const [currrentPath, setCurrentPath] = useState<number | null>(null);

  useEffect(() => {
    const getFiles = async () => {
      const data = await getAllFiles();
      setFiles(data.files);
      setFolders(data.folders);
    };
    getFiles();
  }, []);

  async function viewFile(id: number): Promise<void> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/edm/download/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  function onFolderClick(name: string): void {
    const folder = folders?.find((f) => f.name === name);
    setCurrentPath(folder?.id || null);
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Documents d'Athlonix</h1>
      </header>
      <div className="flex items-center space-x-2 p-4">
        {currrentPath !== null && (
          <CircleArrowLeft
            className="w-8 h-8"
            cursor={'pointer'}
            onClick={() => {
              setCurrentPath(currrentPath ? folders?.find((f) => f.id === currrentPath)?.parent || null : null);
            }}
          />
        )}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="cursor-pointer">
              <BreadcrumbLink onClick={() => setCurrentPath(null)}>Documents</BreadcrumbLink>
            </BreadcrumbItem>
            {currrentPath !== null && (
              <>
                {folders?.map &&
                  getParentFolders(folders, currrentPath).map((f) => (
                    <>
                      <BreadcrumbSeparator key={`separator-${f.id}`} />
                      <BreadcrumbItem key={f.id} className="cursor-pointer">
                        <BreadcrumbLink onClick={() => setCurrentPath(f.id)}>{f.name}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  ))}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-wrap">
        {(files?.length ?? 0) > 0 || (folders?.length ?? 0) > 0 ? (
          <DisplayFolderAndFiles
            folder={folders}
            onFolderClick={onFolderClick}
            files={files}
            onFileClick={viewFile}
            currrentPath={currrentPath}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full p-8">
            <p className="text-gray-500">Aucun document disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}
