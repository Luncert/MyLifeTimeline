import { createContext, createResource } from "solid-js";
import { ControlPanel } from "./ControlPanel";
import { createBucket, useCtx } from "../../mgrui/lib/components/utils";
import getBackend from "../../service/Backend";

interface GalleryCanvasContextDef {
  title: Bucket<string>;
  description: Bucket<string>;
  background: Bucket<string | null>;
}

const GalleryCanvasContext = createContext<GalleryCanvasContextDef>();

export function useGalleryCanvas() {
  return useCtx<GalleryCanvasContextDef>(GalleryCanvasContext as any);
}

export default function GalleryCanvas(){
  const title = createBucket("");
  const description = createBucket("");
  const background = createBucket<string | null>(null);

  return (
    <GalleryCanvasContext.Provider value={{
      title,
      description,
      background
    }}>
      <div class="w-full h-full" style={{
        background: background() !== null ? `url(${background()})` : undefined
      }}>
        <ControlPanel />
      </div>
    </GalleryCanvasContext.Provider>
  )
}