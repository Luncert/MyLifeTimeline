import CurvedPathGallery from "./CurvedPathGallery";
import Timeline from "./Timeline";

export default function GalleryWithTimeline() {
  return (
    <div class="w-full h-full flex">
      <Timeline />
      <CurvedPathGallery />
    </div>
  )
}