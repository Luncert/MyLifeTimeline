import { For, ValidComponent, createContext } from "solid-js";
import { GalleryCanvasControl } from "./GalleryCanvasControl";
import { createBucket, createStampedBucket, useCtx } from "../../mgrui/lib/components/utils";
import MediaFile from "./MediaFile";
import InteractElement from "./InteractElement";

interface GalleryCanvasContextDef {
  title: Bucket<string>;
  description: Bucket<string>;
  background: Bucket<string | null>;
  add(...files: StorageFile[]): void;
}

const GalleryCanvasContext = createContext<GalleryCanvasContextDef>();

export function useGalleryCanvas() {
  return useCtx<GalleryCanvasContextDef>(GalleryCanvasContext as any);
}

export default function GalleryCanvas(){
  const title = createBucket("");
  const description = createBucket("");
  const background = createBucket<string | null>(null);
  const importedFiles = createStampedBucket<StorageFile[]>([]);

  return (
    <GalleryCanvasContext.Provider value={{
      title,
      description,
      background,
      add: (newFiles) => {
        importedFiles((files) => {
          files.push(newFiles);
        });
      }
    }}>
      <div class="w-full h-full bg-cover" style={{
        "background-image": background() !== null ? `url(${background()})` : undefined,
      }}>
        <GalleryCanvasControl />
        <For each={importedFiles().data}>{file => (
          <InteractElement component={MediaFile} class="w-64" file={file} />
        )}</For>
      </div>
    </GalleryCanvasContext.Provider>
  )
}
